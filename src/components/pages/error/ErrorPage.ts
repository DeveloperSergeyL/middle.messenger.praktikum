import Block, { BaseProps } from "../../../core/Block";
import errorPageTpl from "./error.hbs?raw";
import { AppState } from "../../../types";

export interface ErrorPageProps extends BaseProps {
  code: 404 | 500;
  onStateChange: (newState: Partial<AppState>) => void;
}

const DESCRIPTIONS: Record<number, string> = {
  404: "Не туда попали",
  500: "Мы уже фиксим",
};

export default class ErrorPage extends Block<ErrorPageProps> {
  constructor(props: ErrorPageProps) {
    super({
      ...props,
      description: DESCRIPTIONS[props.code] || "Произошла ошибка",
    });
  }

  protected componentDidMount(): void {
    const backBtn = this.element?.querySelector("#error-back-btn");
    backBtn?.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.props.onStateChange({ currentPage: "chat" });
    });
  }

  protected render(): string {
    return errorPageTpl;
  }
}

