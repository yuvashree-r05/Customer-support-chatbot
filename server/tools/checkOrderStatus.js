
const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const Order = require("../models/Order");

const createCheckOrderStatusTool = (userId) =>
  tool(
    async ({ orderId }) => {
      if (!userId) {
        throw new Error("Authenticated user ID is missing.");
      }

      const normalizedOrderId = orderId.trim().toUpperCase();

      const order = await Order.findOne({
        orderId: normalizedOrderId,
        user: userId,
      }).lean();

      if (!order) {
        return {
          found: false,
          message: "No order was found with that order ID.",
        };
      }

      return {
        found: true,
        order: {
          orderId: order.orderId,
          status: order.status,
          estimatedDelivery: order.estimatedDelivery,
        },
      };
    },
    {
      name: "check_order_status",

      description:
        "Use this tool when an authenticated customer asks about the status, shipment progress, or estimated delivery date of a specific order. Requires the customer's order ID. Only returns orders belonging to the authenticated customer. Do not use this tool for refund eligibility.",

      schema: z.object({
        orderId: z
          .string()
          .trim()
          .min(4, "Order ID must contain at least 4 characters.")
          .max(30, "Order ID cannot exceed 30 characters.")
          .regex(
            /^[A-Za-z0-9-]+$/,
            "Order ID can contain only letters, numbers, and hyphens."
          ),
      }),
    }
  );

module.exports = createCheckOrderStatusTool;
