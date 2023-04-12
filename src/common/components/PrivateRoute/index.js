import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import styled from "styled-components"
import NavBar from "../layout/NavBar"

const Container = styled.div`
  min-height: 100vh;
`

const isLoggedIn = () => {
  const isLoggedInFlag = localStorage.getItem("isLoggedIn")

  return isLoggedInFlag === "true"
}

export default function PrivateRoute() {
  if (!isLoggedIn()) {
    // navigate to login
    return <Navigate to="/auth/login" />
  }

  //return page
  return (
    <Container>
      <NavBar />
      <Outlet />
    </Container>
  )
}
