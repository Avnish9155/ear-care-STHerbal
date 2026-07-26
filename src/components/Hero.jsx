import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <p className="hero-tag">🌿 100% Ayurvedic Ear Care</p>

          <h1>
            Natural Care for
            <span> Healthy Ears</span>
          </h1>

          <p className="hero-description">
            Experience the power of Ayurveda with our specially formulated Ear
            Care Capsules. Made with natural ingredients to support your ear
            health.
          </p>

          {/* Buttons */}
          <div className="hero-buttons">
            {/* Order Now */}
            <a href="#order" className="hero-btn primary">
              Order Now
            </a>

            {/* View Product */}
            <a href="#product" className="hero-btn primary">
              View Product
            </a>

            {/* Inquiry */}
            <button
              type="button"
              className="hero-btn primary"
              onClick={() => navigate("/inquiry")}
            >
              Inquiry
            </button>
          </div>

          {/* Features */}
          <div className="hero-features">
            <div>✓ 100% Ayurvedic</div>

            <div>✓ COD Available</div>

            <div>✓ Free Delivery</div>
          </div>
        </div>

        {/* Right Image */}
        <div className="hero-image">
          <img src="/ear-care.png" alt="Ear Care" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
