const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
