const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;
const path = require("path");
const cors = require("cors");
const { corsOptions } = require("./configs/cors-options");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const { connectDB } = require("./configs/connect-db");

const {
  logger,
  errorLogger,
  verifyJwt,
  credentials,
} = require("./middlewares/event-logger");

app.use(logger);

connectDB();

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/public")));

app.use("/register", require("./routers/register"));
app.use("/auth", require("./routers/auth"));
app.use("/create-admin", require("./routers/admin"));
app.use("/signin", require("./routers/loginadmin"));
app.use("/transaction", require("./routers/transaction"));

app.use("/", require("./routers/root"));

app.use(verifyJwt);
app.use("/user", require("./routers/user"));
app.use("/account", require("./routers/account"));
app.use("/deposit", require("./routers/deposit"));
app.use("/transfer", require("./routers/transfer"));
app.use("/external", require("./routers/external"));
app.use("/transaction", require("./routers/transaction"));
app.use("/change-password", require("./routers/change-password"));
app.use("/logout", require("./routers/logout"));
app.use("/refresh", require("./routers/refresh"));

app.use(errorLogger);

mongoose.connection.once("open", () => {
  console.log(`Connected to database...`);
  app.listen(PORT, () =>
    console.log(`Server started on port http://localhost:${PORT}`)
  );
});
