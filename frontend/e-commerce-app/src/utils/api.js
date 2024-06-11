const defaultHeader = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export const getApi = (endpoint) =>
  new Promise((resolve, reject) => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/${endpoint}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch(() => reject());
  });

export const postApi = (endpoint, body) =>
  new Promise((resolve, reject) => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/${endpoint}`,
      {
        method: "POST",
        headers: defaultHeader,
        body: JSON.stringify(body),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch(() => reject());
  });
