import Handlebars from 'handlebars';
import profilePageTpl from './profile.hbs?raw';

export default class ProfilePage {
    constructor({ parentElement, user, profileMode, isAvatarModalOpen, avatarModalState, avatarFileName, avatarModalError, onStateChange, onLogout }) {
        this.parentElement = parentElement;
        this.user = user;
        this.profileMode = profileMode || 'view';
        this.onStateChange = onStateChange;
        this.onLogout = onLogout;
        this.isAvatarModalOpen = isAvatarModalOpen;
        this.avatarModalState = avatarModalState;
        this.avatarFileName = avatarFileName;
        this.avatarModalError = avatarModalError;
    }

    render() {
        const template = Handlebars.compile(profilePageTpl);

        this.parentElement.innerHTML = template({
            user: this.user,
            profileMode: this.profileMode,
            isAvatarModalOpen: this.isAvatarModalOpen,
            avatarModalState: this.avatarModalState,
            avatarFileName: this.avatarFileName,
            avatarModalError: this.avatarModalError
        });

        this.attachListeners();
    }

    attachListeners() {
        const backBtn = document.getElementById('profile-back-btn');
        backBtn?.addEventListener('click', () => {
            if (this.profileMode === 'view') {
                this.onStateChange({ currentPage: 'chat' });
            } else {
                this.onStateChange({ profileMode: 'view' });
            }
        });

        if (this.profileMode === 'view') {
            document.getElementById('edit-data-btn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.onStateChange({ profileMode: 'edit-data' });
            });

            document.getElementById('edit-pass-btn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.onStateChange({ profileMode: 'edit-password' });
            });

            document.getElementById('profile-logout-btn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.onLogout();
            });
        }

        if (this.profileMode === 'edit-data') {
            const dataForm = document.getElementById('profile-data-form');
            dataForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(dataForm);

                const updatedUser = {
                    ...this.user,
                    email: formData.get('email').trim(),
                    login: formData.get('login').trim(),
                    first_name: formData.get('first_name').trim(),
                    second_name: formData.get('second_name').trim(),
                    display_name: formData.get('display_name').trim(),
                    phone: formData.get('phone').trim()
                };

                console.log('Новые данные профиля сохранены:', updatedUser);
                this.onStateChange({ currentUser: updatedUser, profileMode: 'view' });
            });
        }

        if (this.profileMode === 'edit-password') {
            const passForm = document.getElementById('profile-pass-form');
            passForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(passForm);

                const passwords = {
                    oldPassword: formData.get('oldPassword'),
                    newPassword: formData.get('newPassword'),
                    newPasswordConfirm: formData.get('newPasswordConfirm')
                };

                console.log('Пароль успешно изменён:', passwords);
                this.onStateChange({ profileMode: 'view' });
            });
        }

        const avatarTrigger = document.querySelector('.profile-avatar-wrapper');
        avatarTrigger?.addEventListener('click', () => {
            this.onStateChange({
                isAvatarModalOpen: true,
                avatarModalState: 'select',
                avatarFileName: '',
                avatarModalError: null
            });
        });

        if (this.isAvatarModalOpen) {
            const overlay = document.getElementById('avatar-modal-overlay');
            const fileLink = document.getElementById('avatar-choose-link');
            const fileInput = document.getElementById('avatar-file-input');
            const modalForm = document.getElementById('avatar-modal-form');

            overlay?.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.onStateChange({ isAvatarModalOpen: false });
                }
            });

            fileLink?.addEventListener('click', (e) => {
                e.preventDefault();
                fileInput?.click();
            });

            fileInput?.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.onStateChange({
                        avatarModalState: 'uploaded',
                        avatarFileName: file.name,
                        avatarModalError: null
                    });
                }
            });

            modalForm?.addEventListener('submit', (e) => {
                e.preventDefault();

                if (this.avatarModalState === 'select') {
                    this.onStateChange({ avatarModalError: 'Нужно выбрать файл' });
                    return;
                }

                if (this.avatarFileName === 'error.jpg') {
                    this.onStateChange({ avatarModalState: 'error', avatarFileName: '', avatarModalError: null });
                    return;
                }

                console.log(`Аватар ${this.avatarFileName} успешно отправлен на сервер!`);

                this.onStateChange({ isAvatarModalOpen: false });
            });
        }

        const logoutBtn = document.getElementById('profile-logout-btn');
        logoutBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.onLogout();
        });
    }
}
