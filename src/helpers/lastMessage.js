export default function (messagesArray) {
    if (!messagesArray || messagesArray.length === 0) return null;

    const lastDay = messagesArray[messagesArray.length - 1];
    if (!lastDay || !lastDay.list || lastDay.list.length === 0) return null;

    const lastMsg = lastDay.list[lastDay.list.length - 1];

    return {
        ...lastMsg,
        dayDate: lastDay.date
    };
}
