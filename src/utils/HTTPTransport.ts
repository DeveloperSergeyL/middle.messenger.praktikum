export enum Methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export type RequestData = Record<string, unknown> | object | FormData | string;

export interface RequestOptions {
    headers?: Record<string, string>;
    method?: Methods;
    data?: RequestData;
    timeout?: number;
    responseType?: XMLHttpRequestResponseType;
    withCredentials?: boolean;
}

export class HTTPError extends Error {
    public status: number;
    public statusText: string;
    public response: unknown;
    public request: XMLHttpRequest;

    constructor(xhr: XMLHttpRequest, parsedResponse: unknown) {
        super(`HTTP Error ${xhr.status}: ${xhr.statusText}`);
        this.name = 'HTTPError';
        this.status = xhr.status;
        this.statusText = xhr.statusText;
        this.response = parsedResponse;
        this.request = xhr;
    }
}

type HTTPMethod = <R = unknown>(
    url: string,
    options?: Omit<RequestOptions, 'method'>
) => Promise<R>;

function queryStringify(data: Record<string, unknown>): string {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error('Data must be a non-null plain object');
    }

    const params = Object.entries(data)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = Array.isArray(value)
                ? value
                    .filter((item) => item !== undefined && item !== null)
                    .map((item) => encodeURIComponent(String(item)))
                    .join(',')
                : encodeURIComponent(String(value));

            return `${encodedKey}=${encodedValue}`;
        });

    return params.length > 0 ? `?${params.join('&')}` : '';
}

export const BASE_URL = 'https://ya-praktikum.tech/api/v2';

export default class HTTPTransport {
    private baseUrl: string;

    constructor(endpoint = '') {
        const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
        this.baseUrl = cleanEndpoint ? `${BASE_URL}/${cleanEndpoint}` : BASE_URL;
    }

    private buildUrl(url: string): string {
        if (/^https?:\/\//i.test(url)) {
            return url;
        }
        const cleanPath = url.replace(/^\/+/, '');
        return cleanPath ? `${this.baseUrl}/${cleanPath}` : this.baseUrl;
    }

    private parseResponse(xhr: XMLHttpRequest): unknown {
        if (xhr.responseType && xhr.responseType !== 'text') {
            return xhr.response;
        }

        const contentType = xhr.getResponseHeader('Content-Type') || '';
        if (contentType.includes('application/json') && xhr.responseText) {
            try {
                return JSON.parse(xhr.responseText);
            } catch {
                return xhr.responseText;
            }
        }

        return xhr.responseText;
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

    public patch: HTTPMethod = (url, options = {}) => {
        return this.request(
            url,
            { ...options, method: Methods.PATCH },
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
        const {
            headers = {},
            method = Methods.GET,
            data,
            responseType,
            withCredentials = true,
        } = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const isGet = method === Methods.GET;
            const isPlainObject =
                typeof data === 'object' &&
                data !== null &&
                !(data instanceof FormData);

            let fullUrl = this.buildUrl(url);
            if (isGet && isPlainObject) {
                fullUrl += queryStringify(data as Record<string, unknown>);
            }

            xhr.open(method, fullUrl);

            if (responseType) {
                xhr.responseType = responseType;
            }

            xhr.withCredentials = withCredentials;
            xhr.timeout = timeout;

            const hasContentType = Object.keys(headers).some(
                (key) => key.toLowerCase() === 'content-type'
            );

            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });

            xhr.onload = () => {
                const parsedData = this.parseResponse(xhr);

                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(parsedData as R);
                } else {
                    reject(new HTTPError(xhr, parsedData));
                }
            };

            xhr.onabort = () => reject(new Error('Request aborted'));
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.ontimeout = () =>
                reject(new Error(`Request timeout after ${timeout}ms`));

            if (isGet || !data) {
                xhr.send();
            } else if (data instanceof FormData || typeof data === 'string') {
                xhr.send(data);
            } else {
                if (!hasContentType) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                }
                xhr.send(JSON.stringify(data));
            }
        });
    }
}
