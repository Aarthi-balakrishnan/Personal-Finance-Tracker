const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes =require("./routes/auth");
const expenseRoutes =require("./routes/expenses");
const budgetRoutes = require("./routes/budget");
const savingsRoutes =require("./routes/savings");
const PORT =process.env.PORT||5000;

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/expenses",expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/savings",savingsRoutes);
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
 res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"));
});
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log(
            "MongoDB connected"
        );
    app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});    
    }
        );
    })

    .catch((error) => {

        console.log(
            "MongoDB connection error:",
            error
        );

    });
