export enum Methods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export type RequestData = Record<string, unknown> | FormData;

export interface RequestOptions {
    headers?: Record<string, string>;
    method?: Methods;
    data?: RequestData;
    timeout?: number;
}

type HTTPMethod = <R = unknown>(
    url: string,
    options?: Omit<RequestOptions, "method">
) => Promise<R>;

function queryStringify(data: Record<string, unknown>): string {
    if (typeof data !== "object" || data === null) {
        throw new Error("Data must be object");
    }

    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        const value = data[key];
        const encodedValue = Array.isArray(value)
            ? value.map(encodeURIComponent).join(",")
            : encodeURIComponent(String(value));
        return `${result}${encodeURIComponent(key)}=${encodedValue}${index < keys.length - 1 ? "&" : ""
            }`;
    }, "?");
}

export default class HTTPTransport {
    private baseUrl: string;

    constructor(baseUrl = "") {
        this.baseUrl = baseUrl;
    }

    public get: HTTPMethod = (url, options = {}) => {
        return this.request(
            url,
            { ...options, method: Methods.GET },
            options.timeout
        );
    };

    public post: HTTPMethod = (url, options = {}) => {
        return this.request(
            url,
            { ...options, method: Methods.POST },
            options.timeout
        );
    };

    public put: HTTPMethod = (url, options = {}) => {
        return this.request(
            url,
            { ...options, method: Methods.PUT },
            options.timeout
        );
    };

    public delete: HTTPMethod = (url, options = {}) => {
        return this.request(
            url,
            { ...options, method: Methods.DELETE },
            options.timeout
        );
    };

    private request<R = unknown>(
        url: string,
        options: RequestOptions = {},
        timeout = 5000
    ): Promise<R> {
        const { headers = {}, method = Methods.GET, data } = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const isGet = method === Methods.GET;

            const fullUrl =
                isGet && data && !(data instanceof FormData)
                    ? `${this.baseUrl}${url}${queryStringify(data)}`
                    : `${this.baseUrl}${url}`;

            xhr.open(method, fullUrl);

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = () => {
                resolve(xhr as unknown as R);
            };

            xhr.onabort = () => reject(new Error("Запрос отменён"));
            xhr.onerror = () => reject(new Error("Ошибка сети"));

            xhr.timeout = timeout;
            xhr.ontimeout = () => reject(new Error("Превышено время ожидания"));

            if (isGet || !data) {
                xhr.send();
            } else if (data instanceof FormData) {
                xhr.send(data);
            } else {
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(data));
            }
        });
    }
}
