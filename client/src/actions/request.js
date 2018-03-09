import configuration from '../configuration';

const baseApiUrl = configuration.baseApiUrl;

export const request = (method, route, data = null) => {
  const requestConfiguration = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = window.localStorage.getItem('jwtToken');
  if (token != null) {
    requestConfiguration.headers['Authorization'] = `jwt ${token}`;
  }

  if (data != null) {
    requestConfiguration.body = JSON.stringify(data);
  }

  return new Promise((resolve, reject) => {
    fetch(`${baseApiUrl}${route}`, requestConfiguration)
      .then((response) => {
        if (response.status === 404) {
          reject(new Error(response.statusText));
          return;
        }

        if (response.status < 200 || (response.status >= 300 && response.status !== 304)) {
          response.json().then(json => reject(new Error(json.error)));
          return;
        }

        if (response.status !== 204) {
          resolve(response.json());
        } else {
          resolve();
        }
      })
      .catch(() => reject(new Error('Failed to connect to server')));
  });
};