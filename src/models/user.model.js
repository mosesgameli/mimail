// modules
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// user blueprint
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please enter a user name"],
    minlength: [6, "minimum username length is 6 characters"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "you need to choose a password"],
    minlength: [6, "minimum password length is 6 characters"],
  },
  sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "mail" }],
  inbox: [{ type: mongoose.Schema.Types.ObjectId, ref: "mail" }],
});

// encrypt password before saving new user info
userSchema.pre("save", async function (next) {
  const salt = 10;
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// check password for authentication
userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return user;
    }
    throw new Error("incorrect password");
  }
  throw new Error("incorrect username");
};

// export user model
const User = mongoose.model("user", userSchema);
module.exports = User;
