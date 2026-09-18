const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const authRoutes =
    require("./routes/auth");

const expenseRoutes =
    require("./routes/expenses");

const budgetRoutes =
    require("./routes/budget");

const savingsRoutes =
    require("./routes/savings");

dotenv.config();

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());


// ===============================
// API ROUTES
// ===============================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/expenses",
    expenseRoutes
);

app.use(
    "/api/budget",
    budgetRoutes
);

app.use(
    "/api/savings",
    savingsRoutes
);
// ===============================
// FRONTEND
// ===============================

// Serve frontend folder
app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);

// ===============================
// HOME PAGE
// ===============================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});


// ===============================
// MONGODB
// ===============================

mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB connected"
        );

        app.listen(
            process.env.PORT,
            () => {

                console.log(
                    `Server running on http://localhost:${process.env.PORT}`
                );

            }
        );

    })

    .catch((error) => {

        console.log(
            "MongoDB connection error:",
            error
        );

    });