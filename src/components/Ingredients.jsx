function Ingredients() {
  const ingredients = [
    {
      icon: "🌿",
      name: "Ayurvedic Herbs",
      description:
        "Carefully selected herbs traditionally used in Ayurvedic wellness.",
    },
    {
      icon: "🍃",
      name: "Natural Extracts",
      description:
        "Natural plant-based extracts selected for a gentle wellness approach.",
    },
    {
      icon: "🌱",
      name: "Herbal Formula",
      description:
        "A thoughtfully prepared herbal formulation focused on everyday ear care.",
    },
    {
      icon: "✨",
      name: "Quality Ingredients",
      description:
        "Ingredients selected with attention to quality and product consistency.",
    },
  ];

  return (
    <section className="ingredients-section">
      <div className="ingredients-container">

        {/* Heading */}
        <div className="section-heading">
          <p className="section-tag">
            NATURAL INGREDIENTS
          </p>

          <h2>
            Made With Carefully Selected Ingredients
          </h2>

          <p>
            Our formulation combines carefully selected
            ingredients with an Ayurvedic approach to
            everyday ear wellness.
          </p>
        </div>

        {/* Ingredients Cards */}
        <div className="ingredients-grid">
          {ingredients.map((ingredient, index) => (
            <div
              className="ingredient-card"
              key={index}
            >
              <div className="ingredient-icon">
                {ingredient.icon}
              </div>

              <h3>
                {ingredient.name}
              </h3>

              <p>
                {ingredient.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Ingredients;