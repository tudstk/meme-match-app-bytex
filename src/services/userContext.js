import React, { createContext } from "react"
import { useContext } from "react"
import { auth, db } from "../utils/firebase.js"

export const UserContext = createContext()

export default function UserContextProvider() {
  const user = auth.currentUser
}
