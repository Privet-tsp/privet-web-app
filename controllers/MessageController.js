import MessageModel from "../models/message.js";
import UserModel from "../models/User.js";
import MatchModel from "../models/match.js";

export const create = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message:
                    "Сообщения могут отправить только авторизованные пользователи",
            });
        }

        const match = await MatchModel.findById(req.params.id);

        if (!match) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        const doc = new MessageModel({
            matchId: req.params.id,
            sender: req.userId,
            text: req.body.text,
            messageStatus: false,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "Непредвиденная ошибка",
        });
    }
};

export const getDialog = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Страница не найдена",
            });
        }

        const messages = await MessageModel.find({
            matchId: req.params.id,
        });

        if (!messages) {
            return res.status(404).json({
                message: "Диалог не найден",
            });
        }

        const a = await MessageModel.updateMany(
            {
                $and: [
                    {
                        matchId: req.params.id,
                    },
                    {
                        sender: { $ne: req.userId },
                    },
                    {
                        messageStatus: false,
                    },
                ],
            },
            {
                $set: {
                    messageStatus: true,
                },
            }
        );

        res.json(messages);
    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: "Нет доступа",
        });
    }
};
