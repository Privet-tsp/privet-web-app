import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js";
import { registerValidation } from "./validations/auth.js";

mongoose
    .connect(
        "mongodb+srv://admin:wwwwww@cluster0.am9ssuk.mongodb.net/privet?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB ok"))
    .catch((err) => console.log("DB error", err));
const app = express();

app.use(express.json());

app.post("/auth/register", registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            userName: req.body.userName,
            avatarUrl: req.body.avatarUrl,
            passwordHash,
        });

        const user = await doc.save();

        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Ошибка регистрации",
        });
    }
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});