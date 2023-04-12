import React from "react"
import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Find from "../pages/Find"
import PrivateRoute from "../common/components/PrivateRoute"
import Profile from "../pages/Profile"
import MemeMatcher from "../pages/Matcher"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      { path: "find", element: <Find /> },
      { path: "profile", element: <Profile /> },
      { path: "matcher", element: <MemeMatcher /> },
    ],
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
])
