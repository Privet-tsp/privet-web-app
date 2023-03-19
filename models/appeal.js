import mongoose from "mongoose";

const AppealSchema = new mongoose.Schema(
    {
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: Number,
            required: true,
        },
        statusMode: {
            type: Number,
            required: true,
        },
        moderator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Moderator",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Appeal", AppealSchema);
