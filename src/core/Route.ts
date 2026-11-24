import Block, { BaseProps } from "./Block";

export type BlockConstructable<P extends BaseProps = BaseProps> = new (
    props: P
) => Block<P>;

export default class Route<P extends BaseProps = BaseProps> {
    private _pathname: string;
    private _blockClass: BlockConstructable<P>;
    private _block: Block<P> | null = null;
    private _rootQuery: string;
    private _getProps: () => P;

    constructor(
        pathname: string,
        view: BlockConstructable<P>,
        rootQuery: string,
        getProps: () => P = () => ({} as P)
    ) {
        this._pathname = pathname;
        this._blockClass = view;
        this._rootQuery = rootQuery;
        this._getProps = getProps;
    }

    public navigate(pathname: string): void {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    public leave(): void {
        if (this._block) {
            this._block.destroy();
            this._block = null;
        }
    }

    public match(pathname: string): boolean {
        return pathname === this._pathname;
    }

    public render(): void {
        if (this._block) {
            this._block.destroy();
        }

        const root = document.querySelector(this._rootQuery);
        if (!root) return;

        this._block = new this._blockClass(this._getProps());
        root.replaceChildren(this._block.getContent());
        this._block.dispatchComponentDidMount();
    }
}
