import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Inquiry() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    mobileNumber: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Remove error message when user starts typing
    setErrorMessage("");
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://ear-care-stherbal.onrender.com/api/inquiries",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: formData.fullName,
            age: formData.age,
            mobileNumber: formData.mobileNumber,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Inquiry Saved Successfully:", data);

        // Reset Form
        setFormData({
          fullName: "",
          age: "",
          mobileNumber: "",
        });

        // Show Success Screen
        setSubmitted(true);
      } else {
        setErrorMessage(
          data.message || "Unable to submit inquiry. Please try again.",
        );
      }
    } catch (error) {
      console.error("Inquiry Submission Error:", error);

      setErrorMessage(
        "Unable to connect to server. Please make sure the backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUCCESS SCREEN
  // ==========================================

  if (submitted) {
    return (
      <div className="inquiry-page">
        <div className="inquiry-success">
          <div className="success-icon">✓</div>

          <h1>Inquiry Submitted Successfully!</h1>

          <p>Thank you for submitting your inquiry.</p>

          <p>
            आपकी inquiry successfully submit हो गई है। जल्द ही आपको हमारे
            <strong> Doctor Expert </strong>
            का call आएगा।
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="inquiry-home-btn"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // INQUIRY FORM
  // ==========================================

  return (
    <div className="inquiry-page">
      <div className="inquiry-container">
        {/* LEFT INFORMATION */}

        <div className="inquiry-info">
          <p className="inquiry-tag">🩺 EXPERT CONSULTATION</p>

          <h1>
            Get Expert Advice
            <span> for Your Ear Care</span>
          </h1>

          <p>
            If you have any questions or concerns related to your ear health,
            submit your details. Our Doctor Expert will contact you soon.
          </p>

          <div className="inquiry-benefits">
            <div>✓ Expert Guidance</div>

            <div>✓ Personalized Consultation</div>

            <div>✓ Quick Call Back</div>
          </div>
        </div>

        {/* INQUIRY FORM */}

        <div className="inquiry-form-card">
          <h2>Submit Your Inquiry</h2>

          <p>Please enter your details below.</p>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}

            <div className="inquiry-form-group">
              <label htmlFor="fullName">Full Name</label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Age */}

            <div className="inquiry-form-group">
              <label htmlFor="age">Age</label>

              <input
                type="number"
                id="age"
                name="age"
                placeholder="Enter your age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            {/* Mobile Number */}

            <div className="inquiry-form-group">
              <label htmlFor="mobileNumber">Mobile Number</label>

              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                placeholder="Enter 10 digit mobile number"
                maxLength="10"
                pattern="[0-9]{10}"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Error Message */}

            {errorMessage && (
              <div className="inquiry-error-message">{errorMessage}</div>
            )}

            {/* Submit Button */}

            <button
              type="submit"
              className="inquiry-submit-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Inquiry;
