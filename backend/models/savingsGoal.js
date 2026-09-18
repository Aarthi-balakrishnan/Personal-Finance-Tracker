const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        productName: {
            type: String,
            required: true
        },

        targetAmount: {
            type: Number,
            required: true
        },

        savedAmount: {
            type: Number,
            default: 0
        },

        targetDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "SavingsGoal",
    savingsGoalSchema
);