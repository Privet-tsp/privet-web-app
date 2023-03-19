import UserModel from "../models/User.js";
import AppealModel from "../models/appeal.js";

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
