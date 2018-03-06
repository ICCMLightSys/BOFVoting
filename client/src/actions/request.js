import configuration from '../configuration';

const baseApiUrl = configuration.baseApiUrl;
let jwtToken;

export const setJwtToken = (token) => {
  jwtToken = token;
};

export const request = (method, route, data = null) => {
  const requestConfiguration = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `jwt ${jwtToken}`,
    },
  };

  if (data != null) {
    requestConfiguration.body = JSON.stringify(data);
  }

  return new Promise((resolve, reject) => {
    fetch(`${baseApiUrl}${route}`, requestConfiguration)
      .then((response) => {
        if (!response.ok) {
          reject(new Error(response.statusText));
          return;
        }

        if (response.status < 200 || (response.status >= 300 && response.status !== 304)) {
        // if (!response.status.toString().startsWith('2')) {
          response.json().then(json => reject(new Error(json.error)));
          return;
        }

        resolve(response.json());
      });
  });
};