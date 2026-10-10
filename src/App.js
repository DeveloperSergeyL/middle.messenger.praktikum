import { mockChats } from './mocks/mockData.js';
import LoginPage from './components/pages/login/Login.js';
import SignupPage from './components/pages/signup/Signup.js';
import MessengerPage from './components/pages/messenger/Messenger.js';
import ProfilePage from './components/pages/profile/Profile.js';
import ErrorPage from './components/pages/error/ErrorPage.js';


export default class App {
    constructor() {
        this.state = {
            isAuth: false,
            currentPage: 'login',
            activeChatId: null,
            formErrors: null,
            formValues: null,
            searchQuery: '',
            isAttachMenuOpen: false,
            isChatMenuOpen: false,
            activeModal: null,
            modalError: null,
            modalValue: '',
            profileMode: 'view',
            isAvatarModalOpen: false,
            avatarModalState: 'select',
            avatarFileName: '',
            avatarModalError: null,
            currentUser: {
                email: 'pochta@yandex.ru',
                login: 'ivanivanov',
                first_name: 'Иван',
                second_name: 'Иванов',
                display_name: 'Иван',
                phone: '+7 (909) 967 30 30',
                avatarUrl: ''
            }

        };
        this.chats = mockChats;
        this.appElement = document.getElementById('app');

        this.updateState = this.updateState.bind(this);
        this.logout = this.logout.bind(this);
    }

    updateState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    getFilteredChats() {
        const query = this.state.searchQuery.toLowerCase().trim();
        if (!query) return this.chats;
        return this.chats.filter(chat =>
            chat.title.toLowerCase().includes(query)
        );
    }

    logout() {
        localStorage.removeItem('isAuth');
        this.state = {
            isAuth: false,
            currentPage: 'login',
            activeChatId: null,
            formErrors: null,
            formValues: null,
            searchQuery: ''
        };
        this.render();
    }

    render() {
        if (!this.appElement) return;

        if (this.state.currentPage === 404 || this.state.currentPage === 500) {
            const errorPage = new ErrorPage({
                parentElement: this.appElement,
                code: this.state.currentPage,
                onStateChange: this.updateState
            });
            errorPage.render();
            return;
        }

        if (!this.state.isAuth) {
            if (this.state.currentPage === 'signup') {
                const signupPage = new SignupPage({
                    parentElement: this.appElement,
                    errors: this.state.formErrors,
                    values: this.state.formValues,
                    onStateChange: this.updateState
                });
                signupPage.render();
            } else {
                const loginPage = new LoginPage({
                    parentElement: this.appElement,
                    errors: this.state.formErrors,
                    values: this.state.formValues,
                    onStateChange: this.updateState
                });
                loginPage.render();
            }
            return;
        }

        if (this.state.currentPage === 'profile') {
            const profilePage = new ProfilePage({
                parentElement: this.appElement,
                user: this.state.currentUser,
                profileMode: this.state.profileMode,
                isAvatarModalOpen: this.state.isAvatarModalOpen,
                avatarModalState: this.state.avatarModalState,
                avatarFileName: this.state.avatarFileName,
                avatarModalError: this.state.avatarModalError,

                onStateChange: this.updateState,
                onLogout: this.logout
            });
            profilePage.render();
        } else {

            const messengerPage = new MessengerPage({
                parentElement: this.appElement,
                chats: this.getFilteredChats(),
                activeChatId: this.state.activeChatId,
                searchQuery: this.state.searchQuery,
                isAttachMenuOpen: this.state.isAttachMenuOpen,
                isChatMenuOpen: this.state.isChatMenuOpen,
                activeModal: this.state.activeModal,
                modalError: this.state.modalError,
                modalValue: this.state.modalValue,

                onStateChange: this.updateState,
                onLogout: this.logout
            });
            messengerPage.render();

        }
        const searchInput = this.appElement.querySelector('.sidebar__search');
        if (searchInput && this.state.searchQuery) {
            searchInput.value = this.state.searchQuery;

            const length = searchInput.value.length;
            searchInput.focus();
            searchInput.setSelectionRange(length, length);
        }
    }
}
