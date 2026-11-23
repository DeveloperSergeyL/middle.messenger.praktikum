import Route, { BlockConstructable } from "./Route";
import { BaseProps } from "./Block";

export default class Router {
    private static __instance: Router;
    private routes: Route<BaseProps>[] = [];
    private history: History = window.history;
    private _currentRoute: Route | null = null;
    private _rootQuery: string = "#app";
    private _onRouteGuard?: (pathname: string) => string | null;

    constructor(rootQuery: string = "#app") {
        if (Router.__instance) {
            return Router.__instance;
        }
        this._rootQuery = rootQuery;
        Router.__instance = this;
    }

    public setGuard(guard: (pathname: string) => string | null): this {
        this._onRouteGuard = guard;
        return this;
    }

    public use<P extends BaseProps>(
        pathname: string,
        block: BlockConstructable<P>,
        getProps?: () => P
    ): this {
        const route = new Route<P>(pathname, block, this._rootQuery, getProps);
        this.routes.push(route as unknown as Route<BaseProps>);
        return this;
    }

    public start(): void {
        window.onpopstate = (event: PopStateEvent) => {
            const target = event.currentTarget as Window;
            this._onRoute(target.location.pathname);
        };

        this._onRoute(window.location.pathname);
    }

    private _onRoute(pathname: string): void {
        if (this._onRouteGuard) {
            const redirectPath = this._onRouteGuard(pathname);
            if (redirectPath && redirectPath !== pathname) {
                this.go(redirectPath);
                return;
            }
        }

        const route = this.getRoute(pathname) || this.getRoute("/404");
        if (!route) return;

        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route.render();
    }

    public go(pathname: string): void {
        this.history.pushState({}, "", pathname);
        this._onRoute(pathname);
    }

    public back(): void {
        this.history.back();
    }

    public forward(): void {
        this.history.forward();
    }

    public getRoute(pathname: string): Route | undefined {
        return this.routes.find((route) => route.match(pathname));
    }

    public rerenderCurrent(): void {
        if (this._currentRoute) {
            this._currentRoute.render();
        }
    }
}
