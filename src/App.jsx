import { ToastContainer } from "react-toastify"
import React from "react"
import "react-toastify/dist/ReactToastify.css"
import { Demo } from "./Components/Calendar/Calendar"
export const App = () => {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <>
      <Demo />
      <ToastContainer />
    </>
  )
}
