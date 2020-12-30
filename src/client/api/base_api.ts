export interface ApiResponse<T> {
  code: number; // code from server 0
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  body?: Error;
}

function rejectResponse(response: Response, body: Error): ApiError {
  return {
    status: response.status,
    message: body?.message || "something went wrong",
    statusText: response.statusText,
    body,
  };
}

function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }

  return response.json().then(
    (json) => {
      return Promise.reject(rejectResponse(response, json));
    },
    (err) => {
      return Promise.reject(rejectResponse(response, err.body || {}));
    }
  );
}

const BASE_PREFIX = "/api";

export enum HttpMethod {
  Post = "post",
  Get = "get",
  Delete = "delete",
  Put = "put",
}

export class BaseAPI {
  basePrefix: string;

  prefix: string;

  constructor(prefix: string, basePrefix: string = BASE_PREFIX) {
    this.basePrefix = basePrefix;
    this.prefix = prefix;
  }

  async fetch(
    method: HttpMethod,
    url: string,
    body?: RequestInit["body"],
    options?: RequestInit
  ) {
    const fetchUrl = `${this.basePrefix}${
      this.prefix ? `/${this.prefix}` : ""
    }/${url}`;
    const startTime = performance.now();
    return fetch(fetchUrl, {
      method: method,
      body: body,
      credentials: "include",
      ...options,
      headers: { ...options?.headers },
    })
      .then((res: Response) => checkStatus(res))
      .catch((e: TypeError | ApiError) => {
        // e could be TypeError, for example:  CORS issue
        if (e instanceof TypeError) {
          const newRelicError = new Error(
            "Throw error in api call: " +
              fetchUrl +
              " | " +
              e.name +
              " | " +
              e.message +
              " | " +
              e.stack
          );
          throw {
            message: e.name + " | " + e.message,
          };
        }
        // Normal api error
        if (e?.status === 401) {
          localStorage.removeItem("clef_is_login");
          if (!window.location.pathname.includes("/login/")) {
            window.location.reload();
          }
        } else {
          // Still throw the original error
        }
        throw e;
      });
  }

  /**
   * Send HTTP GET request to url
   * @param {string} url The url that GET request will send to.
   * @param {object} params The query params of the query.
   * @param {boolean} onlyData When set to true, we will get the data field
   * @param {object} options extra options to fetch, such as credential
   * @return {object} The response of the HTTP call.
   */
  async get(
    url: string,
    params?: object,
    onlyData = false,
    options?: RequestInit
  ) {
    if (params) {
      if (!url.endsWith("?")) {
        url += "?";
      }
      url += Object.keys(params)
        .map((key) => {
          // @ts-ignore
          return [key, params[key]].map(encodeURIComponent).join("=");
        })
        .join("&");
    }
    const res = await this.fetch(HttpMethod.Get, url, undefined, options);

    return onlyData ? res?.data : res;
  }

  async post(url: string, body?: RequestInit["body"], options?: object) {
    return this.fetch(HttpMethod.Post, url, body, options);
  }

  async put(url: string, body: RequestInit["body"], options?: object) {
    return this.fetch(HttpMethod.Put, url, body, options);
  }

  async postJSON(
    url: string,
    body: object,
    options?: object
  ): Promise<ApiResponse<any>> {
    return this.post(url, JSON.stringify(body), {
      ...options,
      headers: { "Content-Type": "application/json" },
    });
  }

  async postURLParams(url: string, params: object) {
    const form = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      form.append(key, value);
    }
    return this.post(url, form, {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    });
  }

  async postForm(url: string, params: object) {
    const form = new FormData();
    for (const [key, value] of Object.entries(params)) {
      form.append(key, value);
    }
    return this.post(url, form);
  }

  async putForm(url: string, params: object) {
    const form = new FormData();
    for (const [key, value] of Object.entries(params)) {
      form.append(key, value);
    }
    return this.put(url, form);
  }

  async delete(url: string, body?: object, options?: object) {
    return this.fetch(HttpMethod.Delete, url, JSON.stringify(body), {
      ...options,
      headers: { "Content-Type": "application/json" },
    });
  }
}
