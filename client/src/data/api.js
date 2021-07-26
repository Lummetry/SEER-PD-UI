import axios from "axios";

export const nimAPI = axios.create({
  baseURL: `${document.location.origin}/api`
  // baseURL: `http://localhost:5000`
});

export const lensAPIOriginal = axios.create({
  baseURL: `http://20.73.40.110:5002/`
});

// export const lensAPI = nimAPI;
export const lensAPI = lensAPIOriginal;
