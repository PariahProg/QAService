import config from '../config';

const { serverUrl } = config;

export default function got(url, method = 'get', data = {}) {
    if (method === 'get')
    return fetch(serverUrl + url, {
        method,
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
    });

    return fetch(serverUrl + url, {
        method,
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials: 'include',
    });
}