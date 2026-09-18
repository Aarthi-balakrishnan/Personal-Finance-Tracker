const express = require("express");
const Budget = require("../models/Budget");

const router = express.Router();


// Get budget for a month
router.get("/:userId/:month", async (req, res) => {

    try {

        const budget = await Budget.findOne({
            userId: req.params.userId,
            month: req.params.month
        });

        res.json(budget);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to get budget"
        });
    }
});


// Add or update budget
router.post("/", async (req, res) => {

    try {

        const {
            userId,
            month,
            amount
        } = req.body;

        let budget = await Budget.findOne({
            userId,
            month
        });

        if (budget) {

            budget.amount = amount;

            await budget.save();

        } else {

            budget = await Budget.create({
                userId,
                month,
                amount
            });
        }

        res.json({
            message: "Budget saved successfully",
            budget
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to save budget"
        });
    }
});


module.exports = router;