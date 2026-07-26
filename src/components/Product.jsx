function Product() {
  return (
    <section id="product" className="product-section">
      <div className="product-container">
        {/* Product Image */}
        <div className="product-image">
          <img src="/ear-care.png" alt="Ear Care" />
        </div>

        {/* Product Content */}
        <div className="product-content">
          <p className="product-tag">🌿 AYURVEDIC EAR CARE</p>

          <h2>Ear Care Capsules</h2>

          <p className="product-description">
            Natural Ayurvedic care designed to support your everyday ear
            wellness. Our carefully selected formulation is made with quality
            ingredients and developed with care.
          </p>

          {/* Product Features */}
          <div className="product-features">
            <div className="product-feature">
              <span>✓</span>
              <p>100% Ayurvedic Formulation</p>
            </div>

            <div className="product-feature">
              <span>✓</span>
              <p>Natural Ingredients</p>
            </div>

            <div className="product-feature">
              <span>✓</span>
              <p>COD Available</p>
            </div>

            <div className="product-feature">
              <span>✓</span>
              <p>Free Delivery Across India</p>
            </div>
          </div>

          {/* Price */}
          <div className="product-price">
            <span className="old-price">₹4,998</span>

            <span className="current-price">₹2,499</span>

            <span className="discount">Save 50% </span>
          </div>

          {/* Order Button */}
          <a href="#order" className="product-order-btn">
            Order Now
          </a>
        </div>
      </div>
    </section>
  );
}

export default Product;
