export type ValidationFieldName =
    | "first_name"
    | "second_name"
    | "login"
    | "email"
    | "password"
    | "oldPassword"
    | "newPassword"
    | "newPasswordConfirm"
    | "phone"
    | "message";

const VALIDATION_RULES: Record<
    string,
    { regex: RegExp; errorMessage: string }
> = {
    first_name: {
        regex: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
        errorMessage:
            "Латиница или кириллица, первая буква заглавная, без пробелов и цифр (допустим дефис)",
    },
    second_name: {
        regex: /^[A-ZА-ЯЁ][a-zа-яё-]*$/,
        errorMessage:
            "Латиница или кириллица, первая буква заглавная, без пробелов и цифр (допустим дефис)",
    },
    login: {
        regex: /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/,
        errorMessage:
            "От 3 до 20 символов, латиница, цифры (но не только цифры), дефис и подчёркивание",
    },
    email: {
        regex: /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
        errorMessage: "Некорректный формат email (пример: user@domain.ru)",
    },
    password: {
        regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
        errorMessage:
            "От 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра",
    },
    oldPassword: {
        regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
        errorMessage:
            "От 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра",
    },
    newPassword: {
        regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
        errorMessage:
            "От 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра",
    },
    newPasswordConfirm: {
        regex: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
        errorMessage:
            "От 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра",
    },
    phone: {
        regex: /^\+?\d{10,15}$/,
        errorMessage: "От 10 до 15 цифр, может начинаться с +",
    },
    message: {
        regex: /\S+/,
        errorMessage: "Сообщение не должно быть пустым",
    },
};

export function validateField(name: string, value: string): string {
    const rule = VALIDATION_RULES[name];
    if (!rule) return "";
    return rule.regex.test(value.trim()) ? "" : rule.errorMessage;
}

export function validateForm(
    fields: Record<string, string>
): Record<string, string> {
    const errors: Record<string, string> = {};

    Object.entries(fields).forEach(([name, value]) => {
        const error = validateField(name, value);
        if (error) {
            errors[name] = error;
        }
    });

    if (
        "password_confirm" in fields &&
        fields.password !== fields.password_confirm
    ) {
        errors.password_confirm = "Пароли не совпадают";
    }

    if (
        "newPasswordConfirm" in fields &&
        fields.newPassword !== fields.newPasswordConfirm
    ) {
        errors.newPasswordConfirm = "Пароли не совпадают";
    }

    return errors;
}
