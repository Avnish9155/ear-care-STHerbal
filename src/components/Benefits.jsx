function Benefits() {
  const benefits = [
    {
      icon: "🌿",
      title: "100% Ayurvedic",
      description:
        "Made with carefully selected Ayurvedic ingredients for natural ear care.",
    },
    {
      icon: "👂",
      title: "Ear Care Support",
      description:
        "Designed to support healthy ears and everyday ear care naturally.",
    },
    {
      icon: "🛡️",
      title: "Safe & Trusted",
      description:
        "Quality-focused formulation made with care for your wellness.",
    },
    {
      icon: "🚚",
      title: "Free Delivery",
      description:
        "Get your order delivered conveniently to your doorstep across India.",
    },
  ];

  return (
    <section id="benefits" className="benefits-section">
      <div className="benefits-container">

        {/* Section Heading */}
        <div className="section-heading">
          <p className="section-tag">
            WHY CHOOSE US
          </p>

          <h2>
            Why Choose Ear Care ST Herbal?
          </h2>

          <p>
            Experience natural ear care with our Ayurvedic
            approach and customer-focused service.
          </p>
        </div>

        {/* Benefit Cards */}
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div
              className="benefit-card"
              key={index}
            >
              <div className="benefit-icon">
                {benefit.icon}
              </div>

              <h3>
                {benefit.title}
              </h3>

              <p>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Benefits;