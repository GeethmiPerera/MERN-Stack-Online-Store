const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://geethmianjani02:gimmi1234@cluster0.rl4ug.mongodb.net/ECOMMERCE")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));
