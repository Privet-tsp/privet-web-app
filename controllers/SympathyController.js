import UserModel from "../models/User.js";
import SympathyModel from "../models/sympathy.js";

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

        const isUniqueSympathy = await SympathyModel.findOne({
            sender: req.userId,
            receiver: req.params.id,
        });

        if (isUniqueSympathy) {
            return res.status(400).json({
                message: "Симпатия уже создана",
            });
        }

        const doc = new SympathyModel({
            sender: req.userId,
            receiver: req.params.id,
        });

        const sympathy = await doc.save();

        res.json(sympathy);
    } catch (err) {
        return res.status(400).json({
            message: "Непредвиденная ошибка",
        });
    }
};
