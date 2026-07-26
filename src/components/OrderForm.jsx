import { useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderForm() {
  const navigate = useNavigate();

  // ==========================================
  // PRODUCT PRICE
  // ==========================================

  const ORIGINAL_PRICE = 4998;
  const DISCOUNT_PERCENT = 50;
  const PRODUCT_PRICE = 2499;

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    quantity: "1",
  });

  // ==========================================
  // LOADING STATE
  // ==========================================

  const [loading, setLoading] = useState(false);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ==========================================
  // CALCULATE TOTAL AMOUNT
  // ==========================================

  const quantity = Number(formData.quantity);

  const totalAmount = PRODUCT_PRICE * quantity;

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // ORDER DATA
      // ==========================================

      const orderData = {
        // Customer Details
        customerName: formData.name,

        mobileNumber: formData.mobile,

        address: formData.address,

        city: formData.city,

        state: formData.state,

        pincode: formData.pincode,

        // Product Details
        products: [
          {
            name: "Ear Care Capsules",

            quantity: quantity,

            originalPrice: ORIGINAL_PRICE,

            discount: `${DISCOUNT_PERCENT}%`,

            price: PRODUCT_PRICE,
          },
        ],

        // Final Amount
        totalAmount: totalAmount,

        // Payment Method
        paymentMethod: "COD",
      };

      console.log("Sending Order Data:", orderData);

      // ==========================================
      // SEND ORDER TO BACKEND
      // ==========================================

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(orderData),
      });

      // Convert response to JSON
      const data = await response.json();

      // ==========================================
      // CHECK RESPONSE
      // ==========================================

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to place order");
      }

      // ==========================================
      // ORDER SUCCESS
      // ==========================================

      console.log("Order Saved Successfully:", data.order);

      // Redirect to Order Confirmed page
      navigate("/order-confirmed", {
        state: {
          order: data.order,
        },
      });
    } catch (error) {
      console.error("Place Order Error:", error);

      alert(error.message || "Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <section id="order" className="order-section">
      <div className="order-container">
        {/* ==================================
            HEADING
        ================================== */}

        <div className="section-heading">
          <p className="section-tag">PLACE YOUR ORDER</p>

          <h2>Order Ear Care Capsules</h2>

          <p>
            Fill in your details below and our team will contact you to confirm
            your order.
          </p>
        </div>

        {/* ==================================
            PRODUCT PRICE
        ================================== */}

        <div className="order-price-box">
          <p>
            Original Price:
            <span className="original-price">₹{ORIGINAL_PRICE}</span>
          </p>

          <p>
            Discount:
            <span className="discount-price">{DISCOUNT_PERCENT}% OFF</span>
          </p>

          <h3>
            ₹{PRODUCT_PRICE}
            <span>/ Pack</span>
          </h3>
        </div>

        {/* ==================================
            ORDER FORM
        ================================== */}

        <form className="order-form" onSubmit={handleSubmit}>
          {/* ==================================
              FULL NAME
          ================================== */}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* ==================================
              MOBILE NUMBER
          ================================== */}

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>

            <input
              type="tel"
              id="mobile"
              name="mobile"
              placeholder="Enter 10 digit mobile number"
              value={formData.mobile}
              onChange={handleChange}
              maxLength="10"
              pattern="[0-9]{10}"
              required
            />
          </div>

          {/* ==================================
              COMPLETE ADDRESS
          ================================== */}

          <div className="form-group full-width">
            <label htmlFor="address">Complete Address</label>

            <textarea
              id="address"
              name="address"
              placeholder="House No, Street, Village, Area"
              value={formData.address}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          {/* ==================================
              CITY
          ================================== */}

          <div className="form-group">
            <label htmlFor="city">City</label>

            <input
              type="text"
              id="city"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          {/* ==================================
              STATE
          ================================== */}

          <div className="form-group">
            <label htmlFor="state">State</label>

            <input
              type="text"
              id="state"
              name="state"
              placeholder="Enter state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          {/* ==================================
              PINCODE
          ================================== */}

          <div className="form-group">
            <label htmlFor="pincode">Pincode</label>

            <input
              type="text"
              id="pincode"
              name="pincode"
              placeholder="Enter 6 digit pincode"
              value={formData.pincode}
              onChange={handleChange}
              maxLength="6"
              pattern="[0-9]{6}"
              required
            />
          </div>

          {/* ==================================
              QUANTITY
          ================================== */}

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>

            <select
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            >
              <option value="1">1 Pack - ₹2,499</option>

              <option value="2">2 Packs - ₹4,998</option>

              <option value="3">3 Packs - ₹7,497</option>

              <option value="4">4 Packs - ₹9,996</option>

              <option value="5">5 Packs - ₹12,495</option>
            </select>
          </div>

          {/* ==================================
              ORDER SUMMARY
          ================================== */}

          <div className="order-summary full-width">
            <div className="summary-row">
              <span>Price per Pack</span>

              <strong>₹{PRODUCT_PRICE}</strong>
            </div>

            <div className="summary-row">
              <span>Quantity</span>

              <strong>
                {quantity} Pack
                {quantity > 1 ? "s" : ""}
              </strong>
            </div>

            <div className="summary-row total-row">
              <span>Total Amount</span>

              <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
            </div>
          </div>

          {/* ==================================
              PAYMENT METHOD
          ================================== */}

          <div className="payment-method full-width">
            <span>💵 Payment Method:</span>

            <strong>Cash on Delivery (COD)</strong>
          </div>

          {/* ==================================
              SUBMIT BUTTON
          ================================== */}

          <div className="form-submit">
            <button type="submit" disabled={loading}>
              {loading
                ? "Placing Order..."
                : `Place Order - ₹${totalAmount.toLocaleString("en-IN")}`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default OrderForm;
