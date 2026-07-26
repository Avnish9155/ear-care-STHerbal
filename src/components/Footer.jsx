function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <h2>Ear Care ST Herbal</h2>

          <p>Natural Ayurvedic care for your everyday ear wellness.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="#home">Home</a>
          <a href="#benefits">Benefits</a>
          <a href="#product">Product</a>
          <a href="#order">Order Now</a>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>Customer Support</h3>

          <p>📞 Helpline: 7878463670</p>

          <p>🕐 Customer Support: 24×7 Available</p>

          <p>🚚 Free Delivery Available</p>

          <p>💳 COD Available</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Ear Care ST Herbal. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
