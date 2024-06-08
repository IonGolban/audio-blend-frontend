import axios from "axios";

export async function checkAuth(token) {
  if (token) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return axios
    .get("https://localhost:7195/api/v1/music-data/users/isAuth", {headers :{
        'Authorization': `Bearer ${token}`
    }})
    .then((res) => {
      console.log("Is authentificated:", res.data);
      return { isAuth: true, id:res.data.id ,username: res.data.username, email: res.data.email };
    })
    .catch((error) => {
      console.log("Is not authentificated or :", error.message);
      return { isAuth: false, username: null };
    });
}

export function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}
