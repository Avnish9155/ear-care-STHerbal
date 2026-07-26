import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const INQUIRY_STATUSES = ["Pending", "Contacted", "Completed"];

// ======================================================
// HELPERS
// ======================================================

const normalizeStatus = (status) => {
  if (!status) return "Pending";

  const normalized = String(status).trim().toLowerCase();

  const statusMap = {
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    canceled: "Cancelled",
  };

  return statusMap[normalized] || "Pending";
};

const getOrderAmount = (order) => {
  if (!order) return 0;

  const amount =
    order.totalAmount ??
    order.totalPrice ??
    order.amount ??
    order.grandTotal ??
    order.total ??
    0;

  if (typeof amount === "string") {
    const cleanedAmount = amount.replace(/[₹,\s]/g, "");
    const numberAmount = Number(cleanedAmount);

    return Number.isFinite(numberAmount) ? numberAmount : 0;
  }

  const numberAmount = Number(amount);

  return Number.isFinite(numberAmount) ? numberAmount : 0;
};

// ======================================================
// COMPONENT
// ======================================================

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);

  // ======================================================
  // FETCH DATA
  // ======================================================

  const fetchAdminData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [ordersResponse, inquiriesResponse] = await Promise.all([
        fetch(`${API_URL}/orders`),
        fetch(`${API_URL}/inquiries`),
      ]);

      if (!ordersResponse.ok) {
        throw new Error(
          `Orders API failed with status ${ordersResponse.status}`,
        );
      }

      if (!inquiriesResponse.ok) {
        throw new Error(
          `Inquiries API failed with status ${inquiriesResponse.status}`,
        );
      }

      const ordersData = await ordersResponse.json();
      const inquiriesData = await inquiriesResponse.json();

      console.log("ORDERS:", ordersData);
      console.log("INQUIRIES:", inquiriesData);

      if (!ordersData.success) {
        throw new Error(ordersData.message || "Failed to fetch orders");
      }

      if (!inquiriesData.success) {
        throw new Error(inquiriesData.message || "Failed to fetch inquiries");
      }

      setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);

      setInquiries(
        Array.isArray(inquiriesData.inquiries) ? inquiriesData.inquiries : [],
      );
    } catch (error) {
      console.error("Admin Dashboard Error:", error);

      setError(
        error.message ||
          "Unable to load dashboard data. Please make sure backend is running.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchAdminData(false);
  }, [fetchAdminData]);

  // ======================================================
  // UPDATE ORDER STATUS
  // ======================================================

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update order status");
      }

      const updatedStatus = data.order?.orderStatus || newStatus;

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: updatedStatus,
              }
            : order,
        ),
      );

      setSelectedOrder((previousOrder) => {
        if (!previousOrder) return null;

        if (previousOrder._id !== orderId) {
          return previousOrder;
        }

        return {
          ...previousOrder,
          orderStatus: updatedStatus,
        };
      });
    } catch (error) {
      console.error("Update Order Status Error:", error);
      alert(error.message || "Failed to update order status");
    }
  };

  // ======================================================
  // UPDATE INQUIRY STATUS
  // ======================================================

  const updateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/inquiries/${inquiryId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update inquiry status");
      }

      const updatedStatus = data.inquiry?.status || newStatus;

      setInquiries((previousInquiries) =>
        previousInquiries.map((inquiry) =>
          inquiry._id === inquiryId
            ? {
                ...inquiry,
                status: updatedStatus,
              }
            : inquiry,
        ),
      );
    } catch (error) {
      console.error("Update Inquiry Status Error:", error);
      alert(error.message || "Failed to update inquiry status");
    }
  };

  // ======================================================
  // FILTER ORDERS
  // ======================================================

  const filteredOrders = useMemo(() => {
    const searchText = orderSearch.toLowerCase().trim();

    return orders.filter((order) => {
      const customerName = String(order.customerName || "").toLowerCase();

      const mobileNumber = String(order.mobileNumber || "").toLowerCase();

      const matchesSearch =
        !searchText ||
        customerName.includes(searchText) ||
        mobileNumber.includes(searchText);

      const currentStatus = normalizeStatus(order.orderStatus);

      const matchesStatus =
        orderStatusFilter === "All" || currentStatus === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // ======================================================
  // FILTER INQUIRIES
  // ======================================================

  const filteredInquiries = useMemo(() => {
    const searchText = inquirySearch.toLowerCase().trim();

    return inquiries.filter((inquiry) => {
      const fullName = String(inquiry.fullName || "").toLowerCase();

      const mobileNumber = String(inquiry.mobileNumber || "").toLowerCase();

      const matchesSearch =
        !searchText ||
        fullName.includes(searchText) ||
        mobileNumber.includes(searchText);

      const matchesStatus =
        inquiryStatusFilter === "All" || inquiry.status === inquiryStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, inquirySearch, inquiryStatusFilter]);

  // ======================================================
  // STATISTICS
  // ======================================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => normalizeStatus(order.orderStatus) === "Pending",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => normalizeStatus(order.orderStatus) === "Delivered",
  ).length;

  const totalRevenue = orders
    .filter((order) => normalizeStatus(order.orderStatus) !== "Cancelled")
    .reduce((total, order) => total + getOrderAmount(order), 0);

  const totalInquiries = inquiries.length;

  const pendingInquiries = inquiries.filter(
    (inquiry) => String(inquiry.status || "").toLowerCase() === "pending",
  ).length;

  // ======================================================
  // SALES ANALYTICS
  // ======================================================

  const salesAnalyticsData = useMemo(() => {
    const result = ORDER_STATUSES.map((status) => {
      const statusOrders = orders.filter(
        (order) => normalizeStatus(order.orderStatus) === status,
      );

      const revenue = statusOrders.reduce(
        (total, order) => total + getOrderAmount(order),
        0,
      );

      return {
        name: status,
        revenue: Number(revenue) || 0,
        orders: statusOrders.length,
      };
    });

    console.log("SALES ANALYTICS DATA:", result);

    return result;
  }, [orders]);

  // ======================================================
  // MAX REVENUE
  // ======================================================

  const maxRevenue = useMemo(() => {
    const max = Math.max(
      ...salesAnalyticsData.map((item) => Number(item.revenue) || 0),
      0,
    );

    if (max === 0) {
      return 1000;
    }

    return Math.ceil(max * 1.2);
  }, [salesAnalyticsData]);

  // ======================================================
  // WHATSAPP
  // ======================================================

  const openWhatsApp = (mobileNumber) => {
    if (!mobileNumber) return;

    const cleanNumber = String(mobileNumber).replace(/\D/g, "");

    const whatsappNumber =
      cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

    window.open(
      `https://wa.me/${whatsappNumber}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading Admin Dashboard...</div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-error">
          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            onClick={() => fetchAdminData(true)}
            className="admin-refresh-btn"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN
  // ======================================================

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* HEADER */}

        <div className="admin-header">
          <div>
            <p className="admin-tag">ST HERBAL</p>

            <h1>Admin Dashboard</h1>

            <p>Manage orders and customer inquiries from one place.</p>
          </div>

          <button
            onClick={() => fetchAdminData(true)}
            className="admin-refresh-btn"
            disabled={refreshing}
          >
            {refreshing ? "⏳ Refreshing..." : "🔄 Refresh"}
          </button>
        </div>

        {/* STATS */}

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📦</div>

            <div>
              <p>Total Orders</p>
              <h2>{totalOrders}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">⏳</div>

            <div>
              <p>Pending Orders</p>
              <h2>{pendingOrders}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">🚚</div>

            <div>
              <p>Delivered</p>
              <h2>{deliveredOrders}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">💰</div>

            <div>
              <p>Total Revenue</p>

              <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
            </div>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">🩺</div>

            <div>
              <p>Total Inquiries</p>
              <h2>{totalInquiries}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">📞</div>

            <div>
              <p>Pending Inquiries</p>
              <h2>{pendingInquiries}</h2>
            </div>
          </div>
        </div>

        {/* ==================================================
            SALES ANALYTICS
        ================================================== */}

        {/* ==================================================
    SALES ANALYTICS
================================================== */}

        <div className="admin-section analytics-section">
          <div className="admin-section-header">
            <div>
              <h2>📊 Sales Analytics</h2>
              <p>Revenue overview based on order status</p>
            </div>
          </div>

          {/* CHART */}
          <div className="analytics-chart-wrapper">
            <div className="analytics-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesAnalyticsData}
                  margin={{
                    top: 30,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="name"
                    interval={0}
                    tick={{
                      fontSize: 13,
                      fill: "#475569",
                    }}
                    axisLine={{
                      stroke: "#cbd5e1",
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, Math.max(maxRevenue, 1000)]}
                    allowDecimals={false}
                    width={90}
                    tick={{
                      fontSize: 12,
                      fill: "#475569",
                    }}
                    tickFormatter={(value) =>
                      `₹${Number(value || 0).toLocaleString("en-IN")}`
                    }
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(15, 118, 110, 0.08)",
                    }}
                    formatter={(value, name) => {
                      if (name === "Revenue") {
                        return [
                          `₹${Number(value || 0).toLocaleString("en-IN")}`,
                          "Revenue",
                        ];
                      }

                      return [value, "Orders"];
                    }}
                  />

                  <Legend />

                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#0f766e"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={90}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ANALYTICS SUMMARY */}

          <div className="analytics-summary">
            {salesAnalyticsData.map((item) => (
              <div className="analytics-summary-card" key={item.name}>
                <span>{item.name}</span>

                <strong>
                  ₹{Number(item.revenue || 0).toLocaleString("en-IN")}
                </strong>

                <small>
                  {item.orders} Order
                  {item.orders !== 1 ? "s" : ""}
                </small>
              </div>
            ))}
          </div>
        </div>
        {/* ORDERS */}

        <div className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2>📦 Orders</h2>

              <p>Manage customer orders</p>
            </div>

            <span className="result-count">{filteredOrders.length} Orders</span>
          </div>

          <div className="admin-filters">
            <input
              type="text"
              placeholder="🔍 Search customer or mobile..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="admin-search"
            />

            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="All">All Orders</option>

              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="admin-empty">No orders found.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Mobile</th>
                    <th>Address</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong>{order.customerName || "-"}</strong>
                      </td>

                      <td>{order.mobileNumber || "-"}</td>

                      <td>
                        {order.address || "-"}
                        {order.city ? `, ${order.city}` : ""}
                        {order.state ? `, ${order.state}` : ""}
                        {order.pincode ? ` - ${order.pincode}` : ""}
                      </td>

                      <td>
                        {Array.isArray(order.products) &&
                        order.products.length > 0
                          ? order.products.map((product, index) => (
                              <div key={index}>
                                {product.name || "Product"} ×{" "}
                                {product.quantity || 1}
                              </div>
                            ))
                          : "Product"}
                      </td>

                      <td>₹{getOrderAmount(order).toLocaleString("en-IN")}</td>

                      <td>{order.paymentMethod || "COD"}</td>

                      <td>
                        <select
                          value={normalizeStatus(order.orderStatus)}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                          className={`status-select ${normalizeStatus(
                            order.orderStatus,
                          ).toLowerCase()}`}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            className="view-btn"
                            onClick={() => setSelectedOrder(order)}
                          >
                            👁️
                          </button>

                          <a
                            href={`tel:${order.mobileNumber}`}
                            className="call-btn"
                          >
                            📞
                          </a>

                          <button
                            className="whatsapp-btn"
                            onClick={() => openWhatsApp(order.mobileNumber)}
                          >
                            💬
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* INQUIRIES */}

        <div className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2>🩺 Customer Inquiries</h2>

              <p>Manage expert consultation requests.</p>
            </div>

            <span className="result-count">
              {filteredInquiries.length} Inquiries
            </span>
          </div>

          <div className="admin-filters">
            <input
              type="text"
              placeholder="🔍 Search name or mobile..."
              value={inquirySearch}
              onChange={(e) => setInquirySearch(e.target.value)}
              className="admin-search"
            />

            <select
              value={inquiryStatusFilter}
              onChange={(e) => setInquiryStatusFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="All">All Inquiries</option>

              {INQUIRY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="admin-empty">No inquiries found.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry._id}>
                      <td>
                        <strong>{inquiry.fullName || "-"}</strong>
                      </td>

                      <td>{inquiry.age || "-"}</td>

                      <td>{inquiry.mobileNumber || "-"}</td>

                      <td>
                        <select
                          value={inquiry.status || "Pending"}
                          onChange={(e) =>
                            updateInquiryStatus(inquiry._id, e.target.value)
                          }
                          className={`status-select ${(
                            inquiry.status || "Pending"
                          ).toLowerCase()}`}
                        >
                          {INQUIRY_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        {inquiry.createdAt
                          ? new Date(inquiry.createdAt).toLocaleDateString(
                              "en-IN",
                            )
                          : "-"}
                      </td>

                      <td>
                        <div className="action-buttons">
                          <a
                            href={`tel:${inquiry.mobileNumber}`}
                            className="call-btn"
                          >
                            📞
                          </a>

                          <button
                            className="whatsapp-btn"
                            onClick={() => openWhatsApp(inquiry.mobileNumber)}
                          >
                            💬
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ORDER MODAL */}

      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <div>
                <h2>Order Details</h2>

                <p>Order ID: {selectedOrder._id}</p>
              </div>

              <button
                className="modal-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="order-modal-body">
              <div className="modal-info-grid">
                <div>
                  <span>Customer</span>

                  <strong>{selectedOrder.customerName || "-"}</strong>
                </div>

                <div>
                  <span>Mobile</span>

                  <strong>{selectedOrder.mobileNumber || "-"}</strong>
                </div>

                <div>
                  <span>Address</span>

                  <strong>
                    {selectedOrder.address || "-"}
                    {selectedOrder.city ? `, ${selectedOrder.city}` : ""}
                    {selectedOrder.state ? `, ${selectedOrder.state}` : ""}
                    {selectedOrder.pincode ? ` - ${selectedOrder.pincode}` : ""}
                  </strong>
                </div>

                <div>
                  <span>Payment Method</span>

                  <strong>{selectedOrder.paymentMethod || "COD"}</strong>
                </div>

                <div>
                  <span>Order Status</span>

                  <strong>{normalizeStatus(selectedOrder.orderStatus)}</strong>
                </div>
              </div>

              <div className="modal-products">
                <h3>Products</h3>

                {Array.isArray(selectedOrder.products) &&
                selectedOrder.products.length > 0 ? (
                  selectedOrder.products.map((product, index) => (
                    <div className="modal-product-row" key={index}>
                      <span>{product.name || "Product"}</span>

                      <strong>× {product.quantity || 1}</strong>
                    </div>
                  ))
                ) : (
                  <p>No product details available.</p>
                )}
              </div>

              <div className="modal-total">
                <span>Total Amount</span>

                <strong>
                  ₹{getOrderAmount(selectedOrder).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="order-modal-footer">
              <a
                href={`tel:${selectedOrder.mobileNumber}`}
                className="modal-call-btn"
              >
                📞 Call Customer
              </a>

              <button
                className="modal-whatsapp-btn"
                onClick={() => openWhatsApp(selectedOrder.mobileNumber)}
              >
                💬 WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
