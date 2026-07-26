function HowToUse() {
  const steps = [
    {
      number: "01",
      title: "Read the Instructions",
      description:
        "Before using the product, carefully read the instructions provided with the product.",
    },
    {
      number: "02",
      title: "Use as Directed",
      description:
        "Use the product only as directed on the product packaging or as advised by your healthcare professional.",
    },
    {
      number: "03",
      title: "Follow Regularly",
      description:
        "Follow the recommended usage routine consistently for better results.",
    },
  ];

  return (
    <section className="how-to-use-section">
      <div className="how-to-use-container">
        {/* Heading */}
        <div className="section-heading">
          <p className="section-tag">HOW TO USE</p>

          <h2>Simple Steps For Your Ear Care</h2>

          <p>
            Follow the recommended instructions for using your Ear Care ST
            Herbal product.
          </p>
        </div>

        {/* Steps */}
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="use-step" key={index}>
              <div className="use-step-number">{step.number}</div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowToUse;
