import { Link } from "react-router-dom";
import { useState } from "react";
import { useI18n } from "../context/I18nContext";

const FEATURE_CARDS = [
  {
    key: "ai",
    title: "🤖 AI Recommendations",
    text: "Smartly matches you with internships aligned to your skills and career goals.",
    modal: "Our AI analyzes your skills, preferences, and career goals to recommend the most suitable internships.",
  },
  {
    key: "dashboard",
    title: "📊 Smart Dashboard",
    text: "Track your applications, progress, and personalized suggestions easily.",
    modal: "Monitor your applications, track deadlines, and receive smart suggestions on your dashboard.",
  },
];

const INTERNSHIP_TEASERS = [
  { title: "💻 Software Development", text: "Work on real-world projects, build scalable applications, and sharpen your coding skills." },
  { title: "📊 Data Science", text: "Analyze data, build ML models, and gain hands-on experience with AI-driven insights." },
  { title: "🎨 Design", text: "Create stunning user interfaces and engaging user experiences for modern apps." },
  { title: "📈 Marketing", text: "Learn digital marketing, SEO, and branding strategies with top mentors." },
  { title: "💼 Finance", text: "Get exposure to investment strategies, stock analysis, and financial decision making." },
  { title: "🧑‍🤝‍🧑 Human Resources", text: "Learn HR strategies, hiring processes, and people management with industry experts." },
];

export default function Landing() {
  const { t } = useI18n();
  const [activeFeature, setActiveFeature] = useState(null);

  return (
    <>
      <section className="hero" id="home">
        <h2>{t("hero.title")}</h2>
        <p>{t("hero.subtitle")}</p>
        <button className="btn">
          <Link to="/register">🚀 {t("hero.cta")}</Link>
        </button>
      </section>

      <section className="about" id="about">
        <img
          src="https://img.freepik.com/free-vector/office-workers-analyzing-growth-charts_23-2148866845.jpg"
          alt="About RiseIntern"
        />
        <div className="about-text">
          <h2>About RiseIntern</h2>
          <p>
            RiseIntern is a smart internship discovery platform designed to connect students
            with the right opportunities at the right time, under the PM Internship Scheme.
          </p>
          <div className="about-points">
            <div className="about-point">
              <div className="about-point-icon">🎯</div>
              <div className="about-point-text">
                <strong>Smart Matching</strong>
                AI-powered recommendations that align with your skills and career goals.
              </div>
            </div>
            <div className="about-point">
              <div className="about-point-icon">📱</div>
              <div className="about-point-text">
                <strong>User-Friendly Interface</strong>
                Simple, intuitive dashboard designed for maximum ease of use.
              </div>
            </div>
            <div className="about-point">
              <div className="about-point-icon">🌐</div>
              <div className="about-point-text">
                <strong>Multiple Domains</strong>
                Explore opportunities in software development, data science, marketing, finance, HR, and beyond.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <h2>Why Choose RiseIntern?</h2>
        <div className="feature-cards">
          {FEATURE_CARDS.map((feature) => (
            <div key={feature.key} className="card" onClick={() => setActiveFeature(feature)}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {activeFeature && (
        <div className="popup" onClick={() => setActiveFeature(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setActiveFeature(null)}>&times;</span>
            <h2>{activeFeature.title}</h2>
            <p>{activeFeature.modal}</p>
          </div>
        </div>
      )}

      <section className="internships" id="internships">
        <h2>🔥 Explore Internship Opportunities</h2>
        <div className="internship-cards">
          {INTERNSHIP_TEASERS.map((item) => (
            <div key={item.title} className="i-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link to="/internships" className="i-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bot-section" id="bot-help">
        <h2>✨ Need Help? Meet Your AI Bot Assistant</h2>
        <p>
          Get instant answers about internships, resume tips, interview preparation, and career
          guidance. Our smart education bot is available 24/7 to support your journey!
        </p>
        <div className="bot-features">
          <div className="bot-feature">
            <h3>📚 Resume Tips</h3>
            <p>Learn how to craft the perfect resume that stands out to recruiters.</p>
          </div>
          <div className="bot-feature">
            <h3>🎤 Interview Prep</h3>
            <p>Get interview preparation tips, practice common questions, and boost your confidence.</p>
          </div>
          <div className="bot-feature">
            <h3>💼 Internship Guide</h3>
            <p>Understand how to apply, what to expect, and success strategies for internships.</p>
          </div>
        </div>
        <a href="/bot.html" className="bot-btn">🤖 Chat with Bot Now</a>
      </section>

      <footer id="getstarted">
        <div className="footer-container">
          <div>
            <h3>About</h3>
            <a href="#about">Our Mission</a>
            <a href="#features">Features</a>
            <a href="#internships">Opportunities</a>
          </div>
          <div>
            <h3>Resources</h3>
            <a href="#">Blogs</a>
            <a href="#">Help Center</a>
            <a href="#">FAQs</a>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="#">Email: support@riseintern.com</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
          </div>
        </div>
        <p>© 2026 RiseIntern | Designed for Smart Internships ✨</p>
      </footer>
    </>
  );
}
