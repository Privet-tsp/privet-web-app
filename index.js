import express from "express";
import mongoose from "mongoose";
import {
    registerValidation,
    loginValidation,
    moderatorRegisterValidation,
} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as ModeratorController from "./controllers/ModeratorController.js";
import * as AppealController from "./controllers/AppealController.js";

mongoose
    .connect(
        "mongodb+srv://admin:wwwwww@cluster0.am9ssuk.mongodb.net/privet?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB ok"))
    .catch((err) => console.log("DB error", err));
const app = express();

app.use(express.json());

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.patch(
    "/moderation/register",
    moderatorRegisterValidation,
    ModeratorController.register
);
app.post("/moderation/login", ModeratorController.login);
app.get("/moderation/profiles", checkAuth, UserController.getAll);

app.post("/appeal/:id", checkAuth, AppealController.create);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});
