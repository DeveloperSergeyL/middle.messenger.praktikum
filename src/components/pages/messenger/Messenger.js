import Handlebars from 'handlebars';
import messengerPageTpl from './messenger.hbs?raw';

import sidebarTpl from '../../ui/sidebar/sidebar.hbs?raw';
import chatItemTpl from '../../ui/chat-item/chat-item.hbs?raw';
import chatWindowTpl from '../../ui/chat-window/chat-window.hbs?raw';
import messageTpl from '../../ui/message/message.hbs?raw';

Handlebars.registerPartial('sidebar', sidebarTpl);
Handlebars.registerPartial('chat-item', chatItemTpl);
Handlebars.registerPartial('chat-window', chatWindowTpl);
Handlebars.registerPartial('message', messageTpl);

export default class MessengerPage {
    constructor({ parentElement, chats, activeChatId, searchQuery, isAttachMenuOpen, isChatMenuOpen, activeModal, modalError, modalValue, onStateChange, onLogout }) {
        this.parentElement = parentElement;
        this.chats = chats;
        this.activeChatId = activeChatId;
        this.searchQuery = searchQuery;
        this.isAttachMenuOpen = isAttachMenuOpen;
        this.isChatMenuOpen = isChatMenuOpen;
        this.activeModal = activeModal;
        this.modalError = modalError;
        this.modalValue = modalValue;
        this.onStateChange = onStateChange;
        this.onLogout = onLogout;
    }

    render() {
        const activeChat = this.chats.find(chat => chat.id == this.activeChatId);
        const template = Handlebars.compile(messengerPageTpl);

        this.parentElement.innerHTML = template({
            chats: this.chats,
            activeChatId: this.activeChatId,
            activeChat: activeChat,
            isAttachMenuOpen: this.isAttachMenuOpen,
            isChatMenuOpen: this.isChatMenuOpen,
            activeModal: this.activeModal,
            modalError: this.modalError,
            modalValue: this.modalValue
        });

        this.attachListeners();
    }

    attachListeners() {

        this.setupDropdownMenu('attach-btn', this.isAttachMenuOpen, 'isAttachMenuOpen');
        this.setupDropdownMenu('chat-actions-btn', this.isChatMenuOpen, 'isChatMenuOpen');

        const chatListContainer = document.querySelector('.sidebar__chat-list');
        if (chatListContainer) {
            chatListContainer.addEventListener('click', (e) => {
                const chatItem = e.target.closest('.chat-item');
                if (chatItem) {
                    const chatId = chatItem.dataset.id;
                    if (chatId) {
                        this.onStateChange({ activeChatId: chatId });
                    }
                }
            });
        }

        const searchInput = document.querySelector('.sidebar__search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.onStateChange({ searchQuery: e.target.value });
            });
        }

        const addUserBtn = document.getElementById('add-user-btn');
        addUserBtn?.addEventListener('click', () => {
            this.onStateChange({ activeModal: 'add-user', isChatMenuOpen: false, modalError: null, modalValue: '' });
        });

        const deleteUserBtn = document.getElementById('delete-user-btn');
        deleteUserBtn?.addEventListener('click', () => {
            this.onStateChange({ activeModal: 'delete-user', isChatMenuOpen: false, modalError: null, modalValue: '' });
        });

        if (this.activeModal) {
            const modalOverlay = document.getElementById('modal-overlay');
            const modalForm = document.getElementById('modal-form');

            modalOverlay?.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.onStateChange({ activeModal: null, modalError: null, modalValue: '' });
                }
            });

            modalForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = document.getElementById('modal-login');
                const loginValue = input ? input.value.trim() : '';
                const actionType = modalForm.dataset.action;

                if (!loginValue) {
                    this.onStateChange({ modalError: 'Поле не должно быть пустым', modalValue: loginValue });
                } else {
                    console.log(`Действие [${actionType}] выполнено для пользователя: ${loginValue}`);

                    this.onStateChange({ activeModal: null, modalError: null, modalValue: '' });
                }
            });
        }

        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn?.addEventListener('click', () => this.onLogout());

        const profileBtn = document.getElementById('to-profile-btn');
        profileBtn?.addEventListener('click', (e) => {
            e.preventDefault();

            this.onStateChange({ currentPage: 'profile' });
        });

    }

    setupDropdownMenu(buttonId, isOpenFlag, stateKey) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const stateUpdate = { [stateKey]: !isOpenFlag };

            if (!isOpenFlag) {
                if (stateKey === 'isAttachMenuOpen') {
                    stateUpdate.isChatMenuOpen = false;
                } else if (stateKey === 'isChatMenuOpen') {
                    stateUpdate.isAttachMenuOpen = false;
                }
            }

            this.onStateChange(stateUpdate);
        });

        if (isOpenFlag) {
            document.addEventListener('click', () => {
                this.onStateChange({ [stateKey]: false });
            }, { once: true });
        }
    }
}
