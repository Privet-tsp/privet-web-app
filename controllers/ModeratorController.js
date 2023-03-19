import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import ModeratorModel from "../models/moderator.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const moderator = await ModeratorModel.findOne({
            moderatorId: req.body.moderatorId,
            key: "0",
        });

        if (!moderator) {
            return res.status(400).json({
                message: "Некорректные данные",
            });
        }

        const keyTemp = req.body.key;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(keyTemp, salt);

        await ModeratorModel.updateOne(
            {
                moderatorId: req.body.moderatorId,
            },
            {
                key: hash,
                moderatorName: req.body.moderatorName,
                contacts: req.body.contacts,
            }
        );

        const token = jwt.sign(
            {
                _id: moderator._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { key, ...moderatorData } = moderator._doc;

        res.json({ ...moderatorData, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Ошибка регистрации",
        });
    }
};

export const login = async (req, res) => {
    try {
        const moderator = await ModeratorModel.findOne({
            moderatorId: req.body.moderatorId,
        });

        if (!moderator) {
            return res.status(400).json({
                message: "Некорректные данные",
            });
        }

        const isValidKey = await bcrypt.compare(
            req.body.key,
            moderator._doc.key
        );

        if (!isValidKey) {
            return res.status(400).json({
                message: "Некорректные данные",
            });
        }

        const token = jwt.sign(
            {
                _id: moderator._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { key, ...moderatorData } = moderator._doc;

        res.json({ ...moderatorData, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Ошибка авторизации",
        });
    }
};
