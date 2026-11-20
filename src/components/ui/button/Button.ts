import Block, { BaseProps } from "../../../core/Block";
import buttonTpl from "./button.hbs?raw";

export interface ButtonProps extends BaseProps {
    type?: "button" | "submit" | "reset";
    text: string;
    class?: string;
    id?: string;
}

export default class Button extends Block<ButtonProps> {
    constructor(props: ButtonProps) {
        super({
            type: "button",
            ...props,
        });
    }

    protected render(): string {
        return buttonTpl;
    }
}
