function Reviews() {
  const reviews = [
    {
      name: "Rahul Sharma",
      location: "Delhi",
      review:
        "Product order karna easy tha aur delivery bhi time par mil gayi. Overall experience achha raha.",
    },
    {
      name: "Saumya Malhotra",
      location: "Rajasthan",
      review:
        "Website par product ki information clearly di gayi hai. Ordering process simple aur convenient tha.",
    },
    {
      name: "Suresh Kaushik",
      location: "Uttar Pradesh",
      review:
        "Order karne ka process bahut simple tha aur customer support se bhi achha response mila.",
    },
  ];

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        {/* Heading */}
        <div className="section-heading">
          <p className="section-tag">CUSTOMER REVIEWS</p>

          <h2>What Our Customers Say</h2>

          <p>
            See what our customers have to say about their shopping experience.
          </p>
        </div>

        {/* Reviews */}
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div className="review-card" key={index}>
              {/* Stars */}
              <div className="review-stars">★★★★★</div>

              {/* Review */}
              <p className="review-text">"{review.review}"</p>

              {/* Customer */}
              <div className="review-customer">
                <div className="customer-avatar">{review.name.charAt(0)}</div>

                <div>
                  <h4>{review.name}</h4>

                  <span>{review.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
