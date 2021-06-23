// modules
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require('path')
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// variables
const userRoute = require("./src/routes/user.route");
const mailRoute = require("./src/routes/mail.route");
const dbURI = process.env.DB;
const port = process.env.PORT;

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 204,
};

// connect database
mongoose.connect(
  dbURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  () => {
    server.listen(port, () => {
      console.log("SERVER UP & DATABASE CONNECTED");
    });
  }
);

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use(userRoute);
app.use(mailRoute);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + 'index.html'));
});
app.get('/*', (req, res) => {
  res.status(400).sendFile(path.join(__dirname + '404.html'))
})
