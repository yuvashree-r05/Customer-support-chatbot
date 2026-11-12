
const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "History",
  }
);

module.exports = mongoose.model("History", HistorySchema);
