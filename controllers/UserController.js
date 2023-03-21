import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/User.js";
import ModeratorModel from "../models/moderator.js";
import AntipathyModel from "../models/antipathy.js";
import SympathyModel from "../models/sympathy.js";
import MatchModel from "../models/match.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            userName: req.body.userName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );
        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Ошибка регистрации",
        });
    }
};
export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({
                message: "Некорректные данные",
            });
        }

        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPass) {
            return res.status(400).json({
                message: "Некорректные данные",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Ошибка авторизации",
        });
    }
};
export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        const { passwordHash, ...userData } = user._doc;

        res.json({ ...userData });
    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: "Нет доступа",
        });
    }
};
export const getAll = async (req, res) => {
    try {
        const moderator = await ModeratorModel.findById(req.userId);

        if (!moderator) {
            return res.status(400).json({
                message: "Ошибка доступа",
            });
        }

        const users = await UserModel.find();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить список пользователей",
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const moderator = await ModeratorModel.findById(req.userId);
        const user = await UserModel.findById(req.userId);

        if (!moderator && !user) {
            return res.status(400).json({
                message:
                    "Просмотр анкет доступен только для авторизованных пользователей",
            });
        }

        const profile = await UserModel.findById(req.params.id);

        if (user) {
            const { passwordHash, email, ...userData } = profile._doc;
            res.json({ ...userData });
        } else {
            const { passwordHash, ...userData } = profile._doc;
            res.json({ ...userData });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось найти пользователя",
        });
    }
};

export const getSet = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        //СДЕЛАТЬ НОРМАЛЬНО В ДВА РАЗА МЕНЬШЕ ПОИСК!!!!!!!!!!!!!

        const anti = await AntipathyModel.find({
            $or: [{ sender: user._id }, { receiver: user._id }],
        }).distinct("sender");

        const anti2 = await AntipathyModel.find({
            $or: [{ sender: user._id }, { receiver: user._id }],
        }).distinct("receiver");

        const sympathy = await SympathyModel.find({
            $or: [{ sender: user._id }, { receiver: user._id }],
        }).distinct("sender");

        const sympathy2 = await SympathyModel.find({
            $or: [{ sender: user._id }, { receiver: user._id }],
        }).distinct("receiver");

        const match = await MatchModel.find({
            $or: [{ user1: user._id }, { user2: user._id }],
        }).distinct("user1");

        const match2 = await MatchModel.find({
            $or: [{ user1: user._id }, { user2: user._id }],
        }).distinct("user2");

        const result = [
            ...anti,
            ...anti2,
            ...sympathy,
            ...sympathy2,
            ...match,
            ...match2,
        ];

        const users = await UserModel.find({
            $and: [
                {
                    _id: {
                        $ne: req.userId,
                    },
                },
                {
                    _id: {
                        $not: {
                            $in: result,
                        },
                    },
                },
            ],
        }).limit(10);

        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось найти пользователя",
        });
    }
};
