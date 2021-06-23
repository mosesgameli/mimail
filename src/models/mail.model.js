// modules
const mongoose = require("mongoose");

// mail blueprint
const mailSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sender: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: [true, "enter a message title"],
  },
  body: {
    type: String,
    required: [true, "enter a message body"],
  },
});

const Mail = mongoose.model("mail", mailSchema);
module.exports = Mail;
