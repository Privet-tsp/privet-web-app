import MatchModel from "../models/match.js";
import UserModel from "../models/User.js";

export const getAll = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Страница не найдена",
            });
        }

        const matches = await MatchModel.find({
            $or: [
                {
                    user1: req.userId,
                },
                {
                    user2: req.userId,
                },
            ],
        });

        if (!matches) {
            return res.status(404).json({
                message: "Метчи отсутствуют",
            });
        } else {
            res.json(matches);
        }
    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: "Нет доступа",
        });
    }
};
