// client/src/services/api.js
export const getToken = () => localStorage.getItem('token');

export const postWithToken = async (url, data) => {
  const token = getToken();
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};
