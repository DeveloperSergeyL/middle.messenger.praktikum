import Handlebars from 'handlebars';
import loginPageTpl from './login.hbs?raw';

export default class LoginPage {
    constructor({ parentElement, errors, values, onStateChange }) {
        this.parentElement = parentElement;
        this.errors = errors;
        this.values = values;
        this.onStateChange = onStateChange;
    }

    render() {
        const template = Handlebars.compile(loginPageTpl);
        this.parentElement.innerHTML = template({
            errors: this.errors,
            values: this.values
        });
        this.attachListeners();
    }

    attachListeners() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const login = formData.get('login').trim();
            const password = formData.get('password').trim();

            const errors = {};
            const values = { login, password };

            if (!login) errors.login = 'Неверный логин';
            if (!password) errors.password = 'Неверный пароль';

            if (Object.keys(errors).length > 0) {
                this.onStateChange({ formErrors: errors, formValues: values });
            } else {
                localStorage.setItem('isAuth', 'true');
                this.onStateChange({
                    formErrors: null,
                    formValues: null,
                    isAuth: true,
                    currentPage: 'chat'
                });
            }
        });

        const toSignupBtn = document.getElementById('to-signup-btn');
        toSignupBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.onStateChange({ formErrors: null, formValues: null, currentPage: 'signup' });
        });
    }
}
