import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    monthlyBudget: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("Budget", budgetSchema);
