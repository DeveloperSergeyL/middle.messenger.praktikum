import Block, { BaseProps } from "../../../core/Block";
import Input from "../input/Input";
import Button from "../button/Button";
import { validateForm } from "../../../utils/validator";

export interface FormProps extends BaseProps {
    id: string;
    class?: string;
    action?: string;
    inputs: Input[];
    button: Button;
    onSubmit?: (values: Record<string, string>) => void;
}

export default class Form extends Block<FormProps> {
    constructor(props: FormProps) {
        super({
            ...props,
            events: {
                submit: (e: Event) => {
                    e.preventDefault();
                    this._handleSubmit();
                },
            },
        });
    }

    private _handleSubmit(): void {
        const inputs = this.lists.inputs as Input[];
        const values: Record<string, string> = {};

        inputs.forEach((input) => {
            values[input.getName()] = input.getValue().trim();
        });

        const errors = validateForm(values);

        inputs.forEach((input) => {
            const name = input.getName();
            input.setProps({
                value: values[name],
                error: errors[name] || "",
            });
        });

        if (Object.keys(errors).length === 0) {
            console.log(`Отправка формы [${this.props.id}]:`, values);
            this.props.onSubmit?.(values);
        }
    }

    protected render(): string {
        return `
      <form
        class="${this.props.class || ""}"
        id="${this.props.id}"
        ${this.props.action ? `data-action="${this.props.action}"` : ""}
        novalidate
      >
        {{{inputs}}}
        {{{button}}}
      </form>
    `;
    }
}
