import axios from "./axios.js";

export const registerRequest = user => axios.post(`/signUp`, user)
export const loginRequest = user => axios.post(`/signIn`, user)         