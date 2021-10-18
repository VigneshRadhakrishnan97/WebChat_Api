const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
  creator: {
    type: String,
    required: true,
    
  },
  chatname: {
    type: String,
    required: true,
    unique: true,
  },
  users: [],

  chat: [
    {
      email: {
        type: String,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      text: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Chat = mongoose.model("chat", ChatSchema);