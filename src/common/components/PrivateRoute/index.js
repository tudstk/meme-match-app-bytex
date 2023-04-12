import React, { useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import styled from "styled-components"
import NavBar from "../layout/NavBar"
import { auth, db } from "../../../utils/firebase"

const Container = styled.div`
  min-height: 100vh;
`

const isLoggedIn = () => {
  const isLoggedInFlag = localStorage.getItem("isLoggedIn")

  return isLoggedInFlag === "true"
}

export default function PrivateRoute() {
  const [username, setUsername] = useState()
  if (!isLoggedIn()) {
    return <Navigate to="/auth/login" />
  } else {
    const user = auth.currentUser
    const uid = user.uid
    db.collection("users")
      .where("userId", "==", uid)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          const localUsername = userData.username
          setUsername(localUsername)
          console.log("Username:", username)
        } else {
          console.log("No user with this UID found.")
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error)
      })
  }

  //return page
  return (
    <Container>
      <NavBar username={username} />
      <Outlet />
    </Container>
  )
}
