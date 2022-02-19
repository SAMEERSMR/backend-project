require("dotenv").config();
const app = require("express")();
const mongoose = require("mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3001;

// routing
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// Middlewares
const corsOption = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOption));
app.use(bodyParser.json());

// DataBase Connection
mongoose
  .connect(process.env.DATABASE, {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connect");
  })
  .catch((err) => {
    console.log("somthing wrong---", err);
  });

// My Routs

app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log("server running");
});
