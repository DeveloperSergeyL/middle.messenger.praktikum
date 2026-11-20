import { Message, MessageGroup } from "../types";

export interface LastMessageResult extends Message {
  dayDate: string;
}

export default function lastMessage(
  messagesArray?: MessageGroup[]
): LastMessageResult | null {
  if (!messagesArray || messagesArray.length === 0) return null;

  const lastDay = messagesArray[messagesArray.length - 1];
  if (!lastDay || !lastDay.list || lastDay.list.length === 0) return null;

  const lastMsg = lastDay.list[lastDay.list.length - 1];

  return {
    ...lastMsg,
    dayDate: lastDay.date,
  };
}
