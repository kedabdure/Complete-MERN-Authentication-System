/* eslint-disable react/prop-types */
import { useState } from "react";
import { AppContext } from "./AppContext";

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [isLogged, setIsLoggedin] = useState(false)
  const [userData, setUserData] = useState({})

  const value = {
    backendUrl,
    isLogged, setIsLoggedin,
    userData, setUserData
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
