import Handlebars from "handlebars";
import App from './App.js';

import avatarTpl from './components/ui/avatar/avatar.hbs?raw';
import inputTpl from './components/ui/input/input.hbs?raw';
import buttonTpl from './components/ui/button/button.hbs?raw';
import linkTpl from './components/ui/link/link.hbs?raw';
import modalTpl from './components/ui/modal/modal.hbs?raw';
import avatarModalTpl from './components/ui/avatar-modal/avatar-modal.hbs?raw';

Handlebars.registerPartial('avatar', avatarTpl);
Handlebars.registerPartial('input', inputTpl);
Handlebars.registerPartial('button', buttonTpl);
Handlebars.registerPartial('link', linkTpl);
Handlebars.registerPartial('modal', modalTpl);
Handlebars.registerPartial('avatarModal', avatarModalTpl);

import isEqual from "./helpers/isEqual.js";
import isNotEqual from "./helpers/isNotEqual.js";
import formatChatTime from "./helpers/formatChatTime.js";
import lastMessage from "./helpers/lastMessage.js";


Handlebars.registerHelper("isEqual", isEqual);
Handlebars.registerHelper("isNotEqual", isNotEqual);
Handlebars.registerHelper('formatChatTime', formatChatTime);
Handlebars.registerHelper('lastMessage', lastMessage);

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.render();
});
