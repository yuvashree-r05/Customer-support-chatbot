
const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const Order = require("../models/Order");

const createRefundEligibilityTool = (userId) =>
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
          checked: false,
          message: "We couldn't find an order with that ID.",
        };
      }

      if (order.status !== "Delivered" || !order.deliveredAt) {
        return {
          checked: true,
          eligible: false,
          message:
            "Refund eligibility can only be checked for delivered orders.",
        };
      }

      const deliveryDate = new Date(order.deliveredAt);

      if (Number.isNaN(deliveryDate.getTime())) {
        throw new Error("The order has an invalid delivery date.");
      }

      const today = new Date();

      const todayUTC = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate()
      );

      const deliveryUTC = Date.UTC(
        deliveryDate.getUTCFullYear(),
        deliveryDate.getUTCMonth(),
        deliveryDate.getUTCDate()
      );

      const daysSinceDelivery = Math.floor(
        (todayUTC - deliveryUTC) / (24 * 60 * 60 * 1000)
      );

      const withinSevenDays =
        daysSinceDelivery >= 0 && daysSinceDelivery <= 7;

      const eligible = withinSevenDays && order.isDamaged === true;

      return {
        checked: true,
        eligible,
        daysSinceDelivery,
        isDamaged: order.isDamaged,
        message: eligible
          ? "Your order meets the sample refund policy. You can request a refund."
          : !withinSevenDays
            ? "The sample policy allows refund requests within 7 days of delivery."
            : "The sample policy allows refunds only for damaged products.",
      };
    },
    {
      name: "get_refund_eligibility",

      description:
        "Use this tool when an authenticated customer asks whether a specific order qualifies for a refund. Requires the customer's order ID. Retrieve delivery status, delivery date, and damage status from the database. Never ask the customer to provide these details as tool arguments. Only access orders belonging to the authenticated customer. This tool checks eligibility only; it does not process refunds.",

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

module.exports = createRefundEligibilityTool;
