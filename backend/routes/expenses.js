const express = require("express");
const Expense = require("../models/Expense");

const router = express.Router();


// ===============================
// ADD TRANSACTION
// ===============================

router.post("/", async (req, res) => {

    try {

        const {
            userId,
            type,
            amount,
            category,
            description,
            date
        } = req.body;

        if (
            !userId ||
            !type ||
            !amount ||
            !category ||
            !date
        ) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const transaction = await Expense.create({
            userId,
            type,
            amount,
            category,
            description,
            date
        });

        res.status(201).json({
            message: "Transaction added successfully",
            transaction
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to add transaction"
        });
    }
});


// ===============================
// GET ALL TRANSACTIONS
// ===============================

router.get("/:userId", async (req, res) => {

    try {

        const transactions = await Expense.find({
            userId: req.params.userId
        }).sort({
            date: -1
        });

        res.json(transactions);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to get transactions"
        });
    }
});


// ===============================
// UPDATE TRANSACTION
// ===============================

router.put("/:id", async (req, res) => {

    try {

        const {
            type,
            amount,
            category,
            description,
            date
        } = req.body;

        const updatedTransaction =
            await Expense.findByIdAndUpdate(
                req.params.id,
                {
                    type,
                    amount,
                    category,
                    description,
                    date
                },
                {
                    new: true
                }
            );

        if (!updatedTransaction) {

            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json({
            message: "Transaction updated successfully",
            transaction: updatedTransaction
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to update transaction"
        });
    }
});


// ===============================
// DELETE TRANSACTION
// ===============================

router.delete("/:id", async (req, res) => {

    try {

        const deletedTransaction =
            await Expense.findByIdAndDelete(
                req.params.id
            );

        if (!deletedTransaction) {

            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json({
            message: "Transaction deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to delete transaction"
        });
    }
});


module.exports = router;