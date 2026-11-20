import Block, { BaseProps } from "../../../core/Block";
import inputTpl from "./input.hbs?raw";
import { validateField } from "../../../utils/validator";

export interface InputProps extends BaseProps {
    id?: string;
    name: string;
    type?: string;
    label?: string;
    value?: string;
    placeholder?: string;
    class?: string;
    required?: boolean;
    error?: string;
    onBlur?: (name: string, value: string, error: string) => void;
}

export default class Input extends Block<InputProps> {
    constructor(props: InputProps) {
        super({
            type: "text",
            value: "",
            error: "",
            ...props,
        });
    }

    public getValue(): string {
        const input = this.element?.querySelector("input");
        return input ? input.value : String(this.props.value || "");
    }

    public getName(): string {
        return this.props.name;
    }

    public validate(): boolean {
        const currentValue = this.getValue();
        const error = validateField(this.props.name, currentValue);
        this.setProps({ value: currentValue, error });
        return !error;
    }

    protected componentDidMount(): void {
        this._bindInputBlur();
    }

    protected componentDidUpdate(): boolean {
        setTimeout(() => this._bindInputBlur(), 0);
        return true;
    }

    private _bindInputBlur(): void {
        const input = this.element?.querySelector("input");
        if (!input) return;

        input.onblur = () => {
            const val = input.value;
            const error = validateField(this.props.name, val);
            this.setProps({ value: val, error });
            this.props.onBlur?.(this.props.name, val, error);
        };
    }

    protected render(): string {
        return inputTpl;
    }
}
