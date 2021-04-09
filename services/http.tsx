export const http = {
  get: (url, body?) => {
    return fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body): null
      });
  },
  post: (url, body) => {
   return fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
  },
};
