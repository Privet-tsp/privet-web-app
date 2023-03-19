import UserModel from "../models/User.js";
import AntipathyModel from "../models/antipathy.js";

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
                message: "Нельзя отправить антипатию самому себе",
            });
        }

        const isUniqueAntipathy = await AntipathyModel.findOne({
            sender: req.userId,
            receiver: req.params.id,
        });

        if (isUniqueAntipathy) {
            return res.status(400).json({
                message: "Антипатия уже создана",
            });
        }

        const isInverse = await AntipathyModel.findOne({
            sender: req.params.id,
            receiver: req.userId,
        });

        if (isInverse) {
            return res.status(200).json(isInverse);
        }

        const doc = new AntipathyModel({
            sender: req.userId,
            receiver: req.params.id,
        });

        const antipathy = await doc.save();

        res.json(antipathy);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            message: "Непредвиденная ошибка",
        });
    }
};
