const express = require("express");
const SavingsGoal = require("../models/SavingsGoal");

const router = express.Router();


// Get all savings goals
router.get("/:userId", async (req, res) => {

    try {

        const goals =
            await SavingsGoal.find({
                userId: req.params.userId
            }).sort({
                createdAt: -1
            });

        res.json(goals);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to get savings goals"
        });
    }
});


// Add savings goal
router.post("/", async (req, res) => {

    try {

        const {
            userId,
            productName,
            targetAmount,
            savedAmount,
            targetDate
        } = req.body;

        const goal =
            await SavingsGoal.create({
                userId,
                productName,
                targetAmount,
                savedAmount,
                targetDate
            });

        res.status(201).json({
            message: "Savings goal added",
            goal
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to add savings goal"
        });
    }
});


// Delete savings goal
router.delete("/:id", async (req, res) => {

    try {

        await SavingsGoal.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Savings goal deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to delete goal"
        });
    }
});


module.exports = router;