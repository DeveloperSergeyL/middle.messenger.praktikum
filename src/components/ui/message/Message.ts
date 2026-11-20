import Block, { BaseProps } from "../../../core/Block";
import messageTpl from "./message.hbs?raw";

export interface MessageComponentProps extends BaseProps {
    id: string;
    autor: string;
    text?: string;
    imageUrl?: string;
    time: string;
}

export default class MessageComponent extends Block<MessageComponentProps> {
    constructor(props: MessageComponentProps) {
        super(props);
    }

    protected render(): string {
        return messageTpl;
    }
}
