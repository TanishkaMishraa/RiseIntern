import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useI18n } from "../context/I18nContext";

export default function Landing() {
  const { t } = useI18n();
  const [activeFeature, setActiveFeature] = useState(null);

  const FEATURE_CARDS = [
    {
      key: "ai",
      title: t("landing.features.ai.title"),
      text: t("landing.features.ai.text"),
      modal: t("landing.features.ai.modal"),
    },
    {
      key: "dashboard",
      title: t("landing.features.dashboard.title"),
      text: t("landing.features.dashboard.text"),
      modal: t("landing.features.dashboard.modal"),
    },
    {
      key: "notifications",
      title: t("landing.features.notifications.title"),
      text: t("landing.features.notifications.text"),
      modal: t("landing.features.notifications.modal"),
    },
    {
      key: "bilingual",
      title: t("landing.features.bilingual.title"),
      text: t("landing.features.bilingual.text"),
      modal: t("landing.features.bilingual.modal"),
    },
  ];

  const INTERNSHIP_TEASERS = [
    { key: "softwareDev", title: t("landing.internships.softwareDev.title"), text: t("landing.internships.softwareDev.text") },
    { key: "dataScience", title: t("landing.internships.dataScience.title"), text: t("landing.internships.dataScience.text") },
    { key: "design", title: t("landing.internships.design.title"), text: t("landing.internships.design.text") },
    { key: "marketing", title: t("landing.internships.marketing.title"), text: t("landing.internships.marketing.text") },
    { key: "finance", title: t("landing.internships.finance.title"), text: t("landing.internships.finance.text") },
    { key: "hr", title: t("landing.internships.hr.title"), text: t("landing.internships.hr.text") },
  ];

  const ABOUT_POINTS = [
    { key: "matching", icon: "🎯", title: t("landing.about.point.matching.title"), text: t("landing.about.point.matching.text") },
    { key: "interface", icon: "📱", title: t("landing.about.point.interface.title"), text: t("landing.about.point.interface.text") },
    { key: "domains", icon: "🌐", title: t("landing.about.point.domains.title"), text: t("landing.about.point.domains.text") },
  ];

  const VISUAL_HIGHLIGHTS = [
    { icon: "🤖", label: t("landing.about.visual.aiMatched") },
    { icon: "🌐", label: t("landing.about.visual.bilingual") },
    { icon: "📱", label: t("landing.about.visual.mobileReady") },
    { icon: "🔔", label: t("landing.about.visual.liveUpdates") },
  ];

  const BOT_FEATURES = [
    { key: "resume", icon: "📚", title: t("landing.bot.resume.title"), text: t("landing.bot.resume.text") },
    { key: "interview", icon: "🎤", title: t("landing.bot.interview.title"), text: t("landing.bot.interview.text") },
    { key: "guide", icon: "💼", title: t("landing.bot.guide.title"), text: t("landing.bot.guide.text") },
  ];

  useEffect(() => {
    if (!activeFeature) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setActiveFeature(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeFeature]);

  return (
    <>
      <section className="hero" id="home">
        <span className="hero-badge">🇮🇳 {t("hero.badge")}</span>
        <h2>{t("hero.title")}</h2>
        <p>{t("hero.subtitle")}</p>
        <div className="hero-actions">
          <Link to="/register" className="btn">
            🚀 {t("hero.cta")}
          </Link>
          <Link to="/internships" className="btn btn-secondary">
            {t("hero.secondaryCta")}
          </Link>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-visual">
          {VISUAL_HIGHLIGHTS.map((item) => (
            <div key={item.label} className="about-visual__tile">
              <div className="about-visual__icon">{item.icon}</div>
              <div className="about-visual__label">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="about-text">
          <h2>{t("landing.about.heading")}</h2>
          <p>{t("landing.about.description")}</p>
          <div className="about-points">
            {ABOUT_POINTS.map((point) => (
              <div key={point.key} className="about-point">
                <div className="about-point-icon">{point.icon}</div>
                <div className="about-point-text">
                  <strong>{point.title}</strong>
                  {point.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <h2>{t("landing.features.heading")}</h2>
        <div className="feature-cards">
          {FEATURE_CARDS.map((feature) => (
            <div
              key={feature.key}
              className="card"
              role="button"
              tabIndex={0}
              onClick={() => setActiveFeature(feature)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveFeature(feature);
                }
              }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {activeFeature && (
        <div className="popup" onClick={() => setActiveFeature(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close" aria-label={t("landing.popup.closeAriaLabel")} onClick={() => setActiveFeature(null)}>
              &times;
            </button>
            <h2>{activeFeature.title}</h2>
            <p>{activeFeature.modal}</p>
          </div>
        </div>
      )}

      <section className="internships" id="internships">
        <h2>🔥 {t("landing.internships.heading")}</h2>
        <div className="internship-cards">
          {INTERNSHIP_TEASERS.map((item) => (
            <div key={item.key} className="i-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link to="/internships" className="i-btn">
                {t("internshipCard.viewDetails")}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bot-section" id="bot-help">
        <h2>✨ {t("landing.bot.heading")}</h2>
        <p>{t("landing.bot.description")}</p>
        <div className="bot-features">
          {BOT_FEATURES.map((feature) => (
            <div key={feature.key} className="bot-feature">
              <h3>{feature.icon} {feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
        <Link to="/bot" className="bot-btn">🤖 {t("landing.bot.cta")}</Link>
      </section>

      <footer id="getstarted">
        <div className="footer-container">
          <div>
            <h3>{t("landing.footer.aboutHeading")}</h3>
            <a href="#about">{t("landing.footer.ourMission")}</a>
            <a href="#features">{t("landing.footer.features")}</a>
            <a href="#internships">{t("landing.footer.opportunities")}</a>
          </div>
          <div>
            <h3>{t("landing.footer.resourcesHeading")}</h3>
            <a href="#">{t("landing.footer.blogs")}</a>
            <a href="#">{t("landing.footer.helpCenter")}</a>
            <a href="#">{t("landing.footer.faqs")}</a>
          </div>
          <div>
            <h3>{t("landing.footer.contactHeading")}</h3>
            <a href="mailto:support@riseintern.com">support@riseintern.com</a>
            <a href="#">{t("landing.footer.linkedin")}</a>
            <a href="#">{t("landing.footer.twitter")}</a>
          </div>
        </div>
        <p>{t("landing.footer.tagline")}</p>
      </footer>
    </>
  );
}
