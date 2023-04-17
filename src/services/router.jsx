import React from "react"
import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import PrivateRoute from "../common/components/PrivateRoute"
import Profile from "../pages/Profile"
import MemeMatcher from "../pages/Matcher"
import OtherProfile from "../pages/OtherProfile"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "profile/:username", element: <Profile /> },
      { path: "matcher", element: <MemeMatcher /> },
      {
        path: "/:user",
        element: <OtherProfile />,
      },
    ],
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
        index: true,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
])
