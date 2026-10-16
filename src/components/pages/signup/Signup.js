import Handlebars from 'handlebars';
import signupPageTpl from './signup.hbs?raw';

export default class SignupPage {
    constructor({ parentElement, errors, values, onStateChange }) {
        this.parentElement = parentElement;
        this.errors = errors;
        this.values = values;
        this.onStateChange = onStateChange;
    }

    render() {
        const template = Handlebars.compile(signupPageTpl);
        this.parentElement.innerHTML = template({
            errors: this.errors,
            values: this.values
        });
        this.attachListeners();
    }

    attachListeners() {
        const form = document.getElementById('signup-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const fields = ['email', 'login', 'first_name', 'second_name', 'phone', 'password', 'password_confirm'];

            const values = {};
            const errors = {};

            fields.forEach(field => {
                values[field] = formData.get(field).trim();
            });

            if (!values.email) errors.email = 'Поле не должно быть пустым';
            if (!values.login) errors.login = 'Некорректный логин';
            if (!values.first_name) errors.first_name = 'Введите имя';
            if (!values.second_name) errors.second_name = 'Введите фамилию';
            if (!values.phone) errors.phone = 'Введите телефон';
            if (!values.password) errors.password = 'Введите пароль';

            if (values.password && !values.password_confirm) {
                errors.password_confirm = 'Повторите пароль';
            } else if (values.password !== values.password_confirm) {
                errors.password_confirm = 'Пароли не совпадают';
            }

            if (Object.keys(errors).length > 0) {
                this.onStateChange({ formErrors: errors, formValues: values });
            } else {
                console.log('Регистрация успешна, данные отправлены:', values);
                localStorage.setItem('isAuth', 'true');
                this.onStateChange({
                    formErrors: null,
                    formValues: null,
                    isAuth: true,
                    currentPage: 'chat'
                });
            }
        });

        const toLoginBtn = document.getElementById('to-login-btn');
        toLoginBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.onStateChange({ formErrors: null, formValues: null, currentPage: 'login' });
        });
    }
}
