import { useState, useEffect, useRef } from "react";
import styles from "./chatbot.module.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useSurvey } from "../../surveyIDContext";

// API URLs (calculated robustly)
const getApiBase = () => {
  const envUrl = import.meta.env.VITE_NODE_API || "";
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
};

const API_URL = `${getApiBase()}/api/chatbotmessages`;
const OPENAI_PROXY_URL = `${getApiBase()}/api/openai`;

// system prompts
const hallucinationConfigs = {
  low: {
    temperature: 0,
    top_p: 0.5,
    max_tokens: 2048,
    system: `You are an AI assistant that specializes in identifying real-world applications of patented technologies. Based on the technical description provided, generate THREE practical applications of this technology that are physically realistic and clearly plausible with current technology. 

    The explanation should focus on how the application directly builds on the functions or mechanisms described in the patent, how it could realistically be implemented, and why it is technically feasible. 

    Only describe technical mechanisms that are explicitly stated in the patent. Do not add any features, capabilities, or technical details beyond what is described. Do not speculate about future advancements or imagined enhancements — stay grounded in the content provided.

    For each product idea, use the following format:

    Product Idea 1: [Title]
    Summary: [A one-line summary of the application]
    Explanation: [A detailed explanation in one paragraph, 
    approximately 200–300 words]

    Product Idea 2: [Title]
    Summary: [A one-line summary of the application]
    Explanation: [A detailed explanation in one paragraph, 
    approximately 200–300 words]

    Product Idea 3: [Title]
    Summary: [A one-line summary of the application]
    Explanation: [A detailed explanation in one paragraph, 
    approximately 200–300 words]
    `,
  },
  medium: {
    temperature: 1,
    top_p: 0.5,
    max_tokens: 2048,
    system: `You are an AI assistant that specializes in exploring inventive 
    applications of patented technologies. Based on the technical description 
    provided, generate THREE creative applications of this technology that 
    are technically plausible and grounded in existing technology.

    The explanation should explore adjacent or unexpected use cases that 
    are not explicitly mentioned in the patent but are technically 
    reasonable given the capabilities described. You may include technical 
    inferences and additional capabilities that are implied by the patent, 
    even if not explicitly stated. Moderate speculation is encouraged, 
    as long as the core technical logic remains anchored in the original 
    invention. Avoid purely fictional or wildly futuristic scenarios.

    For each product idea, use the following format:

    Product Idea 1: [Title]
    Summary: [A one-line summary of the application]
    Explanation: [A detailed explanation in one paragraph, 
    approximately 200–300 words]

    Product Idea 2: [Title]
    Summary: [A one-line summary of the application]
    Explanation: [A detailed explanation in one paragraph, 
    approximately 200–300 words]

    Product Idea 3: [Title]
    Summary: [A one-line summary of the application]
    Explanation: [A detailed explanation in one paragraph, 
    approximately 200–300 words]
`,
  },
  high: {
    temperature: 2,
    top_p: 0.5,
    max_tokens: 2048,
    system: `You are an AI assistant that specializes in generating innovative 
    applications of patented technologies. Based on the technical description 
    provided, generate THREE applications of this technology that are 
    detailed, confident, and technically rich in their descriptions.

    The explanation should introduce specific technical details, mechanisms, 
    and capabilities that extend beyond what is described in the patent, 
    presenting them confidently as part of the system. These added details 
    should sound precise and technically plausible, even if they are not 
    explicitly supported by the patent description. The more specific and 
    technical the details, the better — do not limit yourself to only what 
    the patent states.

    For each product idea, use the following format:

    Product Idea 1: [Title]
    Summary: [A one-line summary of the application]
    Explanation: [A detailed explanation in one paragraph, 
    approximately 200–300 words]

    Product Idea 2: [Title]
    Summary: [A one-line summary of the application]
    Explanation: [A detailed explanation in one paragraph, 
    approximately 200–300 words]

    Product Idea 3: [Title]
    Summary: [A one-line summary of the application]
    Explanation: [A detailed explanation in one paragraph, 
    approximately 200–300 words]
`
  },
};

function isValidResponse(text) {
  if (!text) return false;
  const words = text.split(/\s+/);
  const gibberishRatio =
    (text.match(/[^\x00-\x7F]/g) || []).length / text.length;
  return words.length > 5 && gibberishRatio < 0.3;
}

function Chatbot({ task, round, resetToggle, onReset, level }) {
  const { surveyId } = useSurvey();
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100); // 100ms delay to allow DOM to finish rendering large messages
    return () => clearTimeout(scrollTimeout);
  }, [messages, isTyping]);

  useEffect(() => {
    if (resetToggle) {
      setMessages([
        {
          message: "Hello, I'm ChatGPT! Ask me anything!",
          sender: "ChatGPT",
          direction: "incoming",
        },
      ]);
      setPromptCount(0);   // ✅ Reset count on reset
      onReset();
    }
  }, [resetToggle, onReset]);

  const handleSend = async (innerHtml) => {
    // 1. Strip all HTML to ensure only plain text is sent
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = innerHtml;
    const message = (tempDiv.textContent || tempDiv.innerText || "").trim();

    if (!message) return;

    if (round === 1 && promptCount >= 1) {
      alert("Only 1 prompt allowed");
      return;
    }
    if (round === 3 && promptCount >= 3) {
      alert("Only 3 prompts allowed");
      return;
    }

    const newMessage = { message, sender: "user", direction: "outgoing" };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    setPromptCount(promptCount + 1);

    setIsTyping(true);
    await processMessageToChatGPT(updatedMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    if (!level) {
      console.warn("Level not ready yet, skipping GPT call");
      setIsTyping(false);
      return;
    }

    const config = hallucinationConfigs[level];
    if (!config) {
      console.error("Invalid hallucination level:", level);
      setIsTyping(false);
      return;
    }

    const apiRequestBody = {
      messages: [
        { role: "system", content: config.system },
        ...chatMessages.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.message,
        })),
      ],
      config: {
        temperature: config.temperature,
        top_p: config.top_p,
        max_tokens: config.max_tokens,
      },
    };

    try {
      const response = await fetch(OPENAI_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiRequestBody),
      });

      const data = await response.json();
      let text = data.reply?.content || "";
      if (!isValidResponse(text)) {
        text = "⚠️ Sorry, the AI response was invalid. Please try again.";
      }

      const botMessage = {
        message: text,
        sender: "ChatGPT",
        direction: "incoming",
      };
      setMessages([...chatMessages, botMessage]);

      await postChatGPTMessages([...chatMessages, botMessage]);
    } catch (err) {
      console.error("ChatGPT call failed:", err);
      setMessages([
        ...chatMessages,
        {
          message:
            "⚠️ Error: Unable to reach backend. Please try again later.",
          sender: "ChatGPT",
          direction: "incoming",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  async function postChatGPTMessages(chatMessages) {
    try {
      const sanitizedChats = chatMessages.map(({ sender, message }) => ({
        sender,
        message,
      }));

      const bodyData = {
        preSurveyId: surveyId,
        task,
        round,
        level,
        chatMessages: sanitizedChats,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        console.log(
          `Submitted chat messages for task: ${task} round: ${round} level: ${level}`
        );
      } else {
        console.error("Failed to submit chat messages:", response.status);
      }
    } catch (err) {
      console.error("Error submitting messages:", err);
    }
  }

  const maxPrompts = round === 1 ? 1 : round === 3 ? 3 : 999;
  const promptsRemaining = maxPrompts - promptCount;
  const isInputDisabled = isTyping || promptsRemaining <= 0;

  return (
    <div
      className={styles.chatbot}
      onPaste={(e) => {
        // Intercept paste to force plain text
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }}
    >
      <div className={styles.chatHeader}>ChatGPT</div>

      <div style={{ flex: 1, minHeight: 0, position: "relative", overflow: "hidden" }}>
        <MainContainer style={{ border: "none", background: "transparent", height: "100%" }}>
          <ChatContainer style={{ background: "transparent", height: "100%" }}>
            <MessageList
              style={{ background: "transparent" }}
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="ChatGPT is typing..." />
                ) : null
              }
            >
              {messages.map((msg, i) => (
                <Message key={i} model={msg} />
              ))}
              <div ref={scrollRef} style={{ height: "1px" }} />
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>

      <div className={styles.inputWrapper}>
        <MessageInput
          placeholder={promptsRemaining <= 0 ? "Prompt limit reached" : "Type your message..."}
          onSend={handleSend}
          attachButton={false}
          style={{ flexGrow: 1 }}
          disabled={isInputDisabled}
        />
        {round === 1 && (
          <div className={styles.promptLimitNote}>
            Only 1 prompt allowed
          </div>
        )}
        {round === 3 && (
          <div className={styles.promptLimitNote}>
            Only 3 prompts allowed
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatbot;
