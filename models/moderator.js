import mongoose from "mongoose";

const ModeratorSchema = new mongoose.Schema({
    moderatorId: {
        type: String,
        required: true,
        unique: true,
    },
    key: {
        type: String,
    },
    moderatorName: {
        type: String,
    },
    contacts: {
        type: String,
    },
});

export default mongoose.model("Moderator", ModeratorSchema, "moderators");
