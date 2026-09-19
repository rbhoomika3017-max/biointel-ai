require("dotenv").config();

const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "BioIntel AI server is working!"
  });
});

// Chat / analysis route
app.use("/api/chat", chatRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`BioIntel AI server running on http://localhost:${PORT}`);
});