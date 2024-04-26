import axios from "axios";

const API= 'http://localhost:3000/api';

export const registerRequest = user => axios.post(`${API}/signUp`, user)
export const loginRequest = user => axios.post(`${API}/signIn`, user)         