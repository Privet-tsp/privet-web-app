import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
        },
        userInfo: {
            type: String,
        },
        profileStatus: {
            type: Boolean,
        },
        lastActivity: {
            type: Date,
        },
        gender: {
            type: Number,
        },
        findGender: {
            type: Number,
        },
        bday: {
            type: Date,
        },
        location: {
            type: String,
        },
        education: {
            type: String,
        },
        profession: {
            type: String,
        },
        searchStatus: {
            type: Number,
        },
        famStatus: {
            type: Number,
        },
        userHeight: {
            type: Number,
        },
        smoking: {
            type: Number,
        },
        alcohol: {
            type: Number,
        },
        political: {
            type: Number,
        },
        lifePath: {
            type: Number,
        },
        hobby: {
            type: String,
        },
        children: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", UserSchema, "users");
