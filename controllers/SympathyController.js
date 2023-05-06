import UserModel from "../models/User.js";
import SympathyModel from "../models/sympathy.js";
import MatchModel from "../models/match.js";

export const create = async (req, res) => {
    try {
        const sender = await UserModel.findById(req.userId);

        if (!sender) {
            return res.status(400).json({
                message: "Недоступный функционал",
            });
        }

        const receiver = await UserModel.findById(req.params.id);

        if (!receiver) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        if (sender.equals(receiver)) {
            return res.status(400).json({
                message: "Нельзя отправить симпатию самому себе",
            });
        }

        const isUniqueSympathy = await SympathyModel.findOne({
            sender: req.userId,
            receiver: req.params.id,
        });

        if (isUniqueSympathy) {
            return res.status(400).json({
                message: "Симпатия уже создана",
            });
        }

        const isInverse = await SympathyModel.findOneAndDelete({
            sender: req.params.id,
            receiver: req.userId,
        });

        if (isInverse) {
            const doc = new MatchModel({
                user1: req.params.id,
                user2: req.userId,
            });

            const match = await doc.save();

            return res.status(200).json({
                message: "Match",
            });
        }

        const doc = new SympathyModel({
            sender: req.userId,
            receiver: req.params.id,
        });

        const sympathy = await doc.save();

        res.json(sympathy);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "Непредвиденная ошибка",
        });
    }
};
