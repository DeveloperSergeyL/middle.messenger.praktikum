import Handlebars from "handlebars";
import EventBus from "./EventBus";

export type BlockEvents = Record<string, EventListener>;

export interface BaseProps {
    events?: BlockEvents;
    [key: string]: unknown;
}

export default abstract class Block<P extends BaseProps = BaseProps> {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_RENDER: "flow:render",
    } as const;

    protected props: P;
    protected children: Record<string, Block>;
    protected lists: Record<string, Block[]>;
    private eventBus: () => EventBus;
    private _element: HTMLElement | null = null;
    private _id: string = Math.random().toString(36).substring(2, 9);

    constructor(propsWithChildren: P = {} as P) {
        const eventBus = new EventBus();
        const { props, children, lists } =
            this._getChildrenAndProps(propsWithChildren);

        this.props = this._makePropsProxy({ ...props, __id: this._id } as P);
        this.children = children;
        this.lists = lists;

        this.eventBus = () => eventBus;
        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    private _registerEvents(eventBus: EventBus): void {
        eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    private _init(): void {
        this.init();
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    protected init(): void { }

    private _componentDidMount(): void {
        this.componentDidMount();
        Object.values(this.children).forEach((child) => {
            child.dispatchComponentDidMount();
        });
    }

    protected componentDidMount(): void { }

    public dispatchComponentDidMount(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    private _componentDidUpdate(oldProps: P, newProps: P): void {
        const response = this.componentDidUpdate(oldProps, newProps);
        if (response) {
            this._render();
        }
    }

    protected componentDidUpdate(_oldProps: P, _newProps: P): boolean {
        void _oldProps;
        void _newProps;
        return true;
    }

    public setProps = (nextProps: Partial<P>): void => {
        if (!nextProps) return;
        Object.assign(this.props, nextProps);
    };

    get element(): HTMLElement | null {
        return this._element;
    }

    private _render(): void {
        const templateString = this.render();
        const fragment = this._compile(templateString);

        this._removeEvents();
        const newElement = fragment.firstElementChild as HTMLElement | null;

        if (this._element && newElement) {
            this._element.replaceWith(newElement);
        }

        this._element = newElement;
        this._addEvents();
    }

    protected abstract render(): string;

    public getContent(): HTMLElement {
        if (!this._element) {
            throw new Error("Элемент компонента ещё не отрендерен");
        }
        return this._element;
    }

    public destroy(): void {
        this._removeEvents();
        this._element?.remove();
    }

    private _compile(templateString: string): DocumentFragment {
        const propsAndStubs: Record<string, unknown> = { ...this.props };

        Object.entries(this.children).forEach(([key, child]) => {
            propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
        });

        Object.entries(this.lists).forEach(([key]) => {
            propsAndStubs[key] = `<div data-id="__l_${key}"></div>`;
        });

        const template = Handlebars.compile(templateString);
        const html = template(propsAndStubs);

        const temp = document.createElement("template");
        temp.innerHTML = html;

        Object.values(this.children).forEach((child) => {
            const stub = temp.content.querySelector(`[data-id="${child._id}"]`);
            if (stub) {
                stub.replaceWith(child.getContent());
            }
        });

        Object.entries(this.lists).forEach(([key, list]) => {
            const stub = temp.content.querySelector(`[data-id="__l_${key}"]`);
            if (stub) {
                const listContent = document.createDocumentFragment();
                list.forEach((item) => {
                    listContent.appendChild(item.getContent());
                });
                stub.replaceWith(listContent);
            }
        });

        return temp.content;
    }

    private _addEvents(): void {
        const { events = {} } = this.props;
        Object.keys(events).forEach((eventName) => {
            this._element?.addEventListener(eventName, events[eventName]);
        });
    }

    private _removeEvents(): void {
        const { events = {} } = this.props;
        Object.keys(events).forEach((eventName) => {
            this._element?.removeEventListener(eventName, events[eventName]);
        });
    }

    private _getChildrenAndProps(propsAndChildren: P): {
        props: P;
        children: Record<string, Block>;
        lists: Record<string, Block[]>;
    } {
        const children: Record<string, Block> = {};
        const lists: Record<string, Block[]> = {};
        const props: Record<string, unknown> = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block) {
                children[key] = value;
            } else if (
                Array.isArray(value) &&
                value.length > 0 &&
                value.every((item) => item instanceof Block)
            ) {
                lists[key] = value;
            } else {
                props[key] = value;
            }
        });

        return { props: props as P, children, lists };
    }

    private _makePropsProxy(props: P): P {
        return new Proxy(props, {
            get: (target, prop: string) => {
                const value = target[prop];
                return typeof value === "function" ? value.bind(target) : value;
            },
            set: (target, prop: string, value: unknown) => {
                const oldTarget = { ...target };
                (target as Record<string, unknown>)[prop] = value;
                this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
                return true;
            },
            deleteProperty: () => {
                throw new Error("Нет доступа");
            },
        });
    }
}
