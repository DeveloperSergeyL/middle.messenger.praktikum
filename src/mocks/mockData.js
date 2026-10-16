import userAvatar1 from '../img/avatar/cat1.jpg';
import userAvatar2 from '../img/avatar/cat2.jpg';
import img from '../img/img/669ba9ae8302dd8dc8860d96939c0cfdc01f9e64.png';

export const mockChats = [
    {
        id: 1,
        title: "Андрей",
        avatarUrl: userAvatar1,
        unreadCount: 2,
        messages: [
            {
                date: "20.06.2020",
                list: [
                    {
                        id: "1",
                        autor: "Андрей",
                        text: "Картинка",
                        time: "10:39"
                    },
                    {
                        id: "2",
                        autor: "Андрей",
                        text: "Изображение",
                        time: "10:49"
                    }]
            }
        ]
    },
    {
        id: 2,
        title: "Киноклуб",
        avatarUrl: userAvatar2,
        unreadCount: 0,
        messages: [
            {
                date: "20.06.2020",
                list: [
                    {
                        id: "1",
                        autor: "Киноклуб",
                        text: "Изображение",
                        time: "10:57"
                    },
                    {
                        id: "2",
                        autor: "My",
                        text: "Стикер",
                        time: "12:00"
                    }]
            }
        ]
    },
    {
        id: 3,
        title: "Илья",
        avatarUrl: userAvatar1,
        unreadCount: 4,
        messages: [
            {
                date: "20.06.2020",
                list: [
                    {
                        id: "1",
                        autor: "My",
                        text: "Что нового?",
                        time: "15:10"
                    },
                    {
                        id: "2",
                        autor: "Илья",
                        text: "Друзья, у меня для вас особенный выпуск новостей!...",
                        time: "15:12"
                    }]
            }
        ]
    },
    {
        id: 4,
        title: "Вадим",
        avatarUrl: userAvatar2,
        activeChatId: true,
        unreadCount: 0,
        messages: [
            {
                date: "19.06.2020",
                list: [
                    {
                        id: "1",
                        autor: "Вадим",
                        text: "Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой. <br><br>Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.",
                        time: "11:56"
                    },
                    {
                        id: "1",
                        autor: "Вадим",
                        imageUrl: img,
                        time: "11:56"
                    },
                    {
                        id: "2",
                        autor: "My",
                        text: "Круто!",
                        time: "12:00"
                    }]
            }
        ]
    },
    {
        id: 5,
        title: "тет-а-теты",
        avatarUrl: userAvatar1,
        unreadCount: 0,
        messages: [
            {
                date: "17.06.2020",
                list: [
                    {
                        id: "1",
                        autor: "My",
                        text: "Что?",
                        time: "10:49"
                    },
                    {
                        id: "2",
                        autor: "тет-а-теты",
                        text: "И Human Interface Guidelines и Material Design рекомендуют...",
                        time: "10:49"
                    }]
            }
        ]
    },
    {
        id: 6,
        title: "1, 2, 3",
        avatarUrl: userAvatar2,
        unreadCount: 0,
        messages: [
            {
                date: "15.06.2020",
                list: [
                    {
                        id: "1",
                        autor: "My",
                        text: "Новости",
                        time: "10:49"
                    },
                    {
                        id: "2",
                        autor: "1, 2, 3",
                        text: "Миллионы россиян ежедневно проводят десятки часов свое...",
                        time: "10:49"
                    }]
            }
        ]
    },
    {
        id: 7,
        title: "Design Destroyer",
        avatarUrl: userAvatar1,
        unreadCount: 0,
        messages: [
            {
                date: "15.06.2020",
                list: [
                    {
                        id: "1",
                        autor: "My",
                        text: "Что нового?",
                        time: "10:49"
                    },
                    {
                        id: "2",
                        autor: "Design Destroyer",
                        text: "В 2008 году художник Jon Rafman  начал собирать...",
                        time: "10:49"
                    }]
            }
        ]
    },
    {
        id: 8,
        title: "Day.",
        avatarUrl: userAvatar2,
        unreadCount: 0,
        messages: [
            {
                date: "01.05.2020",
                list: [
                    {
                        id: "1",
                        autor: "My",
                        text: "Почему?",
                        time: "10:49"
                    },
                    {
                        id: "2",
                        autor: "Day.",
                        text: "Так увлёкся работой по курсу, что совсем забыл его анонсир...",
                        time: "10:49"
                    }]
            }
        ]
    },
    {
        id: 9,
        title: "Стас Рогозин",
        avatarUrl: userAvatar1,
        unreadCount: 0,
        messages: [
            {
                date: "12.04.2020",
                list: [
                    {
                        id: "1",
                        autor: "My",
                        text: "Когда?",
                        time: "10:30"
                    },
                    {
                        id: "2",
                        autor: "Стас Рогозин",
                        text: "Можно или сегодня или завтра вечером.",
                        time: "10:49"
                    }]
            }
        ]
    }

]