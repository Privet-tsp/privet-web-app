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
import * as SympathyController from "./controllers/SympathyController.js";
import * as AntipathyController from "./controllers/AntipathyController.js";
import * as MessageController from "./controllers/MessageController.js";
import * as MatchController from "./controllers/MatchController.js";

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

app.get("/profile/:id", checkAuth, UserController.getProfile);
app.get("/profile", checkAuth, UserController.getAll);
app.put("/edit", checkAuth, UserController.profile);

app.patch(
    "/moderation/register",
    moderatorRegisterValidation,
    ModeratorController.register
);
app.post("/moderation/login", ModeratorController.login);

app.post("/appeal/new/:id", checkAuth, AppealController.create);
app.get("/appeal", checkAuth, AppealController.getAll);
app.patch("/appeal/result/:id", checkAuth, AppealController.updateStatus);
app.get("/appeal/:id", checkAuth, AppealController.getAppeal);

app.post("/profile/sympathy/:id", checkAuth, SympathyController.create);
app.post("/profile/antipathy/:id", checkAuth, AntipathyController.create);

app.get("/set", checkAuth, UserController.getSet);
app.post("/message/new/:id", checkAuth, MessageController.create);
app.get("/matches", checkAuth, MatchController.getAll);
app.get("/message/view/:id", checkAuth, MessageController.getDialog);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});
