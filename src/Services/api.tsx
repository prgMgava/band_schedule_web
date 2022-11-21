import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3333/",
})

// export const api = axios.create({
//   baseURL: "http://212.1.214.156:3333/",
// })
