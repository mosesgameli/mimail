// modules
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let errors = { username: "", password: "" };

  if (err.message === "incorrect username") {
    errors.username = err.message;
  }

  if (err.message === "incorrect password") {
    errors.password = err.message;
  }

  if (err.code === 11000) {
    errors.username = "the username is not available";

    return errors;
  }

  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 24 * 60 * 60;

// creating a bearer token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: maxAge,
  });
};

// object to contain all auth control functions
const userCtrl = {};

// signup a user
userCtrl.signup = async function (req, res) {
  const { username, password } = req.body;

  try {
    let user = await User.create({ username, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ username: user.username, message: 'signup successful' });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

userCtrl.login = async function (req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ username: user.username, message: 'login successful' });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

userCtrl.auth = async function (req, res, next) {
  let str = req.cookies.jwt
  try {
    let sndr = await User.findOne({ username: req.body.sender })
    if (sndr) {
      const decode = jwt.verify(str, process.env.SECRET)
      if (decode.id == sndr._id) {
        next()
      }
    } else {
      throw new Error('unknown sender')
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = userCtrl;
