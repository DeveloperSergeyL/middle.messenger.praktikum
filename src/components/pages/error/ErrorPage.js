import Handlebars from 'handlebars';
import errorPageTpl from './error.hbs?raw';

export default class ErrorPage {
    constructor({ parentElement, code, onStateChange }) {
        this.parentElement = parentElement;
        this.code = code;
        this.onStateChange = onStateChange;

        this.descriptions = {
            404: 'Не туда попали',
            500: 'Мы уже фиксим'
        };
    }

    render() {
        const template = Handlebars.compile(errorPageTpl);

        this.parentElement.innerHTML = template({
            code: this.code,
            description: this.descriptions[this.code] || 'Произошла ошибка'
        });

        this.attachListeners();
    }

    attachListeners() {
        const backBtn = document.getElementById('error-back-btn');
        backBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.onStateChange({ currentPage: 'chat' });
        });
    }
}
