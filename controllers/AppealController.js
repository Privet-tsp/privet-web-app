import UserModel from "../models/User.js";
import AppealModel from "../models/appeal.js";
import ModeratorModel from "../models/moderator.js";

export const create = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message:
                    "Жалобу могут отправить только авторизованные пользователи",
            });
        }

        const receiver = await UserModel.findById(req.params.id);

        if (!receiver) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        const doc = new AppealModel({
            receiver: req.params.id,
            reason: req.body.reason,
            statusMode: 0,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        return res.status(400).json({
            message: "Непредвиденная ошибка",
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

        const appeals = await AppealModel.find().populate("receiver");
        res.json(appeals);
    } catch (err) {
        return res.status(400).json({
            message: "Непредвиденная ошибка",
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const moderator = await ModeratorModel.findById(req.userId);

        if (!moderator) {
            return res.status(400).json({
                message: "Ошибка доступа",
            });
        }

        const appealId = req.params.id;

        await AppealModel.updateOne(
            {
                _id: appealId,
            },
            {
                statusMode: req.body.statusMode,
                moderator: req.userId,
            }
        );

        res.json({
            success: true,
        });
    } catch (err) {
        return res.status(400).json({
            message: "Непредвиденная ошибка",
        });
    }
};

export const getAppeal = async (req, res) => {
    try {
        const moderator = await ModeratorModel.findById(req.userId);

        if (!moderator) {
            return res.status(400).json({
                message: "Ошибка доступа",
            });
        }

        const appealId = req.params.id;
        const appeal = await AppealModel.findById(appealId);

        res.json(appeal);
    } catch (err) {
        return res.status(400).json({
            message: "Непредвиденная ошибка",
        });
    }
};
