import { body } from "express-validator";

export const loginValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен быть минимум 5 символов").isLength({
        min: 5,
    }),
];

export const registerValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен быть минимум 5 символов").isLength({
        min: 5,
    }),
    body("userName", "Укажите имя").isLength({ min: 2 }),
    body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(),
];

export const moderatorRegisterValidation = [
    body("moderatorId", "Слишком короткий id").isLength({
        min: 2,
    }),
    body("key", "Ключ должен быть минимум 5 символов").isLength({
        min: 5,
    }),
    body("moderatorName", "Укажите имя").isLength({ min: 2 }),
    body("contacts", "Укажите контакты").isLength({ min: 10 }),
];
