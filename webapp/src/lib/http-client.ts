/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * make http client to certain endpoint
 * @param endpoint service endpoint
 * @param json true when to send json body
 * @param param2 additional fetch parameters
 */
export async function client<T>(
  endpoint: string,
  json: boolean,
  { method, body, ...customConf }: RequestInit = {}
): Promise<T> {
  let headers;
  if (json) {
    headers = { 'Content-Type': 'application/json' };
  }

  const config: RequestInit = {
    method,
    ...customConf,
    headers: {
      ...headers,
      ...customConf.headers,
    },
  };

  if (body) {
    if (json) {
      config.body = JSON.stringify(body);
    } else {
      const formData = new FormData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const name in body as { [key: string]: any }) {
        formData.append(name, body[name]);
      }
      config.body = formData;
    }
  }

  let data: T;
  try {
    const response = await window.fetch(endpoint, config);
    data = await response.json();
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return data;
  } catch (err) {
    return Promise.reject(err.toString() ?? err.message);
  }
}

/**
 * make HTTP get request to endpint
 * @param endpoint target endpoint
 * @param customConf request init config
 */
client.get = <T>(endpoint: string, customConf: RequestInit = {}) => {
  return client<T>(endpoint, true, { method: 'GET', ...customConf });
};

/**
 * make HTTP post request to endpoint
 * @param endpoint arget endpoint
 * @param body payload
 * @param json true when sending json body
 * @param customConf request init config
 */
client.post = <T>(
  endpoint: string,
  body?: BodyInit | any,
  json = false,
  customConf: RequestInit = {}
) => {
  return client<T>(endpoint, json, { method: 'POST', body, ...customConf });
};

/**
 * make HTTP put request to endpoint
 * @param endpoint arget endpoint
 * @param body payload
 * @param json true when sending json body
 * @param customConf request init config
 */
client.put = <T>(
  endpoint: string,
  body?: BodyInit | any,
  json = false,
  customConf: RequestInit = {}
) => {
  return client<T>(endpoint, json, { method: 'PUT', body, ...customConf });
};

/**
 * make HTTP delete request to endpoint
 * @param endpoint arget endpoint
 * @param body payload
 * @param json true when sending json body
 * @param customConf request init config
 */
client.del = <T>(
  endpoint: string,
  body?: BodyInit | any,
  json = false,
  customConf: RequestInit = {}
) => {
  return client<T>(endpoint, json, { method: 'DELETE', body, ...customConf });
};
