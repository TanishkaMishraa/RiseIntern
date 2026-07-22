import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../context/I18nContext";
import { useAuth } from "../context/AuthContext";
import { sendChatMessage } from "../api/chat";

let nextId = 1;
function makeMessage(sender, text, quickReplies) {
  return { id: nextId++, sender, text, quickReplies };
}

export default function Bot() {
  const { t } = useI18n();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const CATEGORIES = [
    { key: "resume", icon: "📚", title: t("landing.bot.resume.title") },
    { key: "interview", icon: "🎤", title: t("landing.bot.interview.title") },
    { key: "guide", icon: "💼", title: t("landing.bot.guide.title") },
  ];

  const ITEMS = CATEGORIES.flatMap((category) =>
    [1, 2, 3, 4].map((n) => ({
      category: category.key,
      question: t(`bot.${category.key}.q${n}.question`),
      answer: t(`bot.${category.key}.q${n}.answer`),
    }))
  );

  const categoryQuickReplies = () =>
    CATEGORIES.map((c) => ({ label: `${c.icon} ${c.title}`, action: { type: "category", key: c.key } }));

  const [messages, setMessages] = useState(() => [
    makeMessage("bot", t("bot.greeting")),
    makeMessage("bot", t("bot.chooseCategory"), categoryQuickReplies()),
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const aiHistoryRef = useRef([]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function botReply(newMessages, delay = 500) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((current) => [...current, ...newMessages]);
    }, delay);
  }

  function handleCategoryClick(category) {
    setMessages((current) => [...current, makeMessage("user", `${category.icon} ${category.title}`)]);
    botReply([
      makeMessage(
        "bot",
        t("bot.chooseQuestion"),
        ITEMS.filter((item) => item.category === category.key).map((item) => ({
          label: item.question,
          action: { type: "question", question: item.question },
        }))
      ),
    ]);
  }

  function respondWithCannedAnswer(userText, item) {
    setMessages((current) => [...current, makeMessage("user", userText)]);
    botReply([
      makeMessage("bot", item ? item.answer : t("bot.noMatchFallback")),
      makeMessage("bot", t("bot.anythingElse"), categoryQuickReplies()),
    ]);
  }

  function handleQuickReply(reply) {
    if (reply.action.type === "category") {
      handleCategoryClick(CATEGORIES.find((c) => c.key === reply.action.key));
    } else if (reply.action.type === "question") {
      const item = ITEMS.find((i) => i.question === reply.action.question);
      respondWithCannedAnswer(reply.action.question, item);
    } else if (reply.action.type === "login") {
      navigate("/login");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    setMessages((current) => [...current, makeMessage("user", text)]);

    if (!isAuthenticated) {
      botReply([
        makeMessage("bot", t("bot.loginToChatMessage"), [
          { label: t("auth.loginLink"), action: { type: "login" } },
        ]),
      ]);
      return;
    }

    setIsTyping(true);
    try {
      const { reply } = await sendChatMessage(text, aiHistoryRef.current, token);
      aiHistoryRef.current = [
        ...aiHistoryRef.current,
        { role: "user", content: text },
        { role: "assistant", content: reply },
      ].slice(-20);
      setIsTyping(false);
      setMessages((current) => [...current, makeMessage("bot", reply)]);
    } catch (err) {
      setIsTyping(false);
      setMessages((current) => [...current, makeMessage("bot", err.message || t("bot.chatErrorFallback"))]);
    }
  }

  return (
    <section className="help-page">
      <div className="help-header">
        <h2>{t("bot.pageTitle")}</h2>
        <p>{t("bot.pageSubtitle")}</p>
      </div>

      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble chat-bubble--${msg.sender}`}>
              <p>{msg.text}</p>
              {msg.quickReplies && (
                <div className="chat-quick-replies">
                  {msg.quickReplies.map((reply) => (
                    <button key={reply.label} type="button" onClick={() => handleQuickReply(reply)}>
                      {reply.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble chat-bubble--bot chat-bubble--typing" aria-label={t("bot.typingAriaLabel")}>
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form className="chat-input-row" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="chatInput">
            {t("bot.inputAriaLabel")}
          </label>
          <input
            id="chatInput"
            type="text"
            placeholder={t("bot.inputPlaceholder")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" aria-label={t("bot.sendButtonAriaLabel")}>
            ➤
          </button>
        </form>
      </div>

      <p className="help-footer">
        {t("bot.stillNeedHelp")}{" "}
        <a href="mailto:support@riseintern.com">support@riseintern.com</a>
      </p>
    </section>
  );
}
