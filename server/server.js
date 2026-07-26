const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Inquiry = require("./models/Inquiry");
const Order = require("./models/Order");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error(
      "❌ MongoDB Connection Failed:",
      error.message
    );
  });


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ear Care ST Herbal API is running...",
  });
});


// ==========================================
// ================= INQUIRY APIs ==========
// ==========================================


// ==========================================
// SUBMIT INQUIRY
// ==========================================

app.post("/api/inquiries", async (req, res) => {
  try {
    const {
      fullName,
      age,
      mobileNumber,
    } = req.body;

    // Validation
    if (!fullName || !age || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Create Inquiry
    const inquiry = await Inquiry.create({
      fullName,
      age,
      mobileNumber,
    });

    // Success Response
    res.status(201).json({
      success: true,
      message:
        "Your inquiry has been submitted successfully. Our Doctor Expert will call you soon.",
      inquiry,
    });

  } catch (error) {
    console.error(
      "Inquiry Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
    });
  }
});


// ==========================================
// GET ALL INQUIRIES
// ==========================================

app.get("/api/inquiries", async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });

  } catch (error) {
    console.error(
      "Get Inquiries Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
    });
  }
});


// ==========================================
// UPDATE INQUIRY STATUS
// ==========================================

app.put("/api/inquiries/:id/status", async (req, res) => {
  try {
    const {
      status,
    } = req.body;

    // Allowed Inquiry Status
    const allowedStatuses = [
      "Pending",
      "Contacted",
      "Completed",
    ];

    // Validate Status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry status",
      });
    }

    // Update Inquiry
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status: status,
      },
      {
        new: true,
      }
    );

    // Inquiry Not Found
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Success Response
    res.status(200).json({
      success: true,
      message:
        "Inquiry status updated successfully",
      inquiry,
    });

  } catch (error) {
    console.error(
      "Update Inquiry Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update inquiry status",
    });
  }
});


// ==========================================
// ================= ORDER APIs =============
// ==========================================


// ==========================================
// SUBMIT ORDER
// ==========================================

app.post("/api/orders", async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      address,
      city,
      state,
      pincode,
      products,
      totalAmount,
      paymentMethod,
    } = req.body;

    // Validation
    if (
      !customerName ||
      !mobileNumber ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !products ||
      !totalAmount
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all required fields",
      });
    }

    // Create Order
    const order = await Order.create({
      customerName,
      mobileNumber,
      address,
      city,
      state,
      pincode,
      products,
      totalAmount,
      paymentMethod:
        paymentMethod || "COD",
    });

    // Success Response
    res.status(201).json({
      success: true,
      message:
        "Order placed successfully!",
      order,
    });

  } catch (error) {
    console.error(
      "Order Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to place order",
    });
  }
});


// ==========================================
// GET ALL ORDERS
// ==========================================

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(
      "Get Orders Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch orders",
    });
  }
});


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const {
      status,
    } = req.body;

    // Allowed Order Status
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    // Validate Status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Update Order
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus: status,
      },
      {
        new: true,
      }
    );

    // Order Not Found
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Success Response
    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });

  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update order status",
    });
  }
});


// ==========================================
// SERVER START
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});