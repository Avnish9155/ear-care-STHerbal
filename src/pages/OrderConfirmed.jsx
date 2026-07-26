import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmed.css";

function OrderConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();

  // Order data received from OrderForm
  const order = location.state?.order;

  return (
    <div className="order-confirmed-page">
      <div className="order-confirmed-card">
        {/* Success Icon */}
        <div className="order-success-icon">✓</div>

        {/* Heading */}
        <h1>Order Placed Successfully!</h1>

        <p className="order-success-message">
          Thank you for placing your order with
          <strong> ST Herbal Care</strong>.
        </p>

        {/* Order Details */}
        {order && (
          <div className="confirmed-order-details">
            <div className="confirmed-detail-row">
              <span>Order ID</span>

              <strong>#{order._id}</strong>
            </div>

            <div className="confirmed-detail-row">
              <span>Customer Name</span>

              <strong>{order.customerName}</strong>
            </div>

            <div className="confirmed-detail-row">
              <span>Product</span>

              <strong>Ear Care Capsules</strong>
            </div>

            <div className="confirmed-detail-row">
              <span>Quantity</span>

              <strong>{order.products?.[0]?.quantity || 1} Pack</strong>
            </div>

            <div className="confirmed-detail-row">
              <span>Payment Method</span>

              <strong>Cash on Delivery</strong>
            </div>

            <div className="confirmed-detail-row total">
              <span>Total Amount</span>

              <strong>₹{order.totalAmount?.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        )}

        {/* Doctor / Team Message */}
        <div className="confirmed-message">
          <div className="confirmed-message-icon">📞</div>

          <div>
            <h3>What happens next?</h3>

            <p>हमारी टीम जल्द ही आपको call करके आपके order को confirm करेगी।</p>

            <p>
              Our team will contact you soon to confirm your order and delivery
              details.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="confirmed-buttons">
          <button
            type="button"
            className="confirmed-home-btn"
            onClick={() => navigate("/")}
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmed;
