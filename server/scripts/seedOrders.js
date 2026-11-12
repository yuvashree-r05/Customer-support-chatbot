
require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Customer_Support_Chatbot",
    });

    console.log("MongoDB connected");

    // Find the two oldest registered customers
    const users = await User.find().sort({ createdAt: 1 }).limit(2);

    if (users.length < 2) {
      throw new Error("Create two customer accounts before seeding orders.");
    }

    const sampleOrderIds = [
      "ORD1001",
      "ORD1002",
      "ORD1003",
      "ORD1004",
      "ORD1005",
      "ORD1006",
      "ORD1007",
      "ORD1008",
      "ORD1009",
      "ORD1010",
      "ORD1011",
      "ORD1012",
    ];

    // Remove only the sample orders managed by this script
    await Order.deleteMany({
      orderId: { $in: sampleOrderIds },
    });

    // Create sample orders for the two customers
    const orders = [
      // Customer 1
      {
        orderId: "ORD1001",
        user: users[0]._id,
        status: "Shipped",
        estimatedDelivery: new Date("2026-11-15"),
        isDamaged: false,
      },
      {
        orderId: "ORD1003",
        user: users[0]._id,
        status: "Delivered",
        estimatedDelivery: new Date("2026-11-05"),
        deliveredAt: new Date("2026-11-05"),
        isDamaged: true,
      },
      {
        orderId: "ORD1004",
        user: users[0]._id,
        status: "Processing",
        estimatedDelivery: new Date("2026-11-19"),
        isDamaged: false,
      },
      {
        orderId: "ORD1005",
        user: users[0]._id,
        status: "Cancelled",
        estimatedDelivery: null,
        isDamaged: false,
      },
      {
        orderId: "ORD1008",
        user: users[0]._id,
        status: "Delivered",
        estimatedDelivery: new Date("2026-11-01"),
        deliveredAt: new Date("2026-11-01"),
        isDamaged: true,
      },
      {
        orderId: "ORD1010",
        user: users[0]._id,
        status: "Delivered",
        estimatedDelivery: new Date("2026-11-10"),
        deliveredAt: new Date("2026-11-10"),
        isDamaged: false,
      },

      // Customer 2
      {
        orderId: "ORD1002",
        user: users[1]._id,
        status: "Processing",
        estimatedDelivery: new Date("2026-11-18"),
        isDamaged: false,
      },
      {
        orderId: "ORD1006",
        user: users[1]._id,
        status: "Delivered",
        estimatedDelivery: new Date("2026-11-09"),
        deliveredAt: new Date("2026-11-09"),
        isDamaged: true,
      },
      {
        orderId: "ORD1007",
        user: users[1]._id,
        status: "Shipped",
        estimatedDelivery: new Date("2026-11-16"),
        isDamaged: false,
      },
      {
        orderId: "ORD1009",
        user: users[1]._id,
        status: "Delivered",
        estimatedDelivery: new Date("2026-11-10"),
        deliveredAt: new Date("2026-11-10"),
        isDamaged: false,
      },
      {
        orderId: "ORD1011",
        user: users[1]._id,
        status: "Processing",
        estimatedDelivery: new Date("2026-11-20"),
        isDamaged: false,
      },
      {
        orderId: "ORD1012",
        user: users[1]._id,
        status: "Shipped",
        estimatedDelivery: new Date("2026-11-17"),
        isDamaged: false,
      },
    ];

    await Order.insertMany(orders);

    console.log("12 sample orders created successfully");
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedOrders();
