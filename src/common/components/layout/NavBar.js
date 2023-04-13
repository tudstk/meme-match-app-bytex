import React from "react"
import styled from "styled-components"

import { Link, useNavigate } from "react-router-dom"
import { Button } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHouse,
  faRightToBracket,
  faUserPen,
  faUser,
  faFireFlameCurved,
} from "@fortawesome/free-solid-svg-icons"

const Layout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid white;
  height: 60px;
  position: sticky;
  top: 0;
  width: 100%;
  background: linear-gradient(to left, #34e89e, #0f3443);
  z-index: 200;
`
const Navigation = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;

  li,
  a,
  svg,
  span {
    color: white;
  }

  li {
    list-style-type: none;
    margin: 0px 20px;

    :last-child {
      margin: 0px;
    }
  }
  a {
    text-decoration: none;
    :hover {
      color: #ffffffc4;
    }
  }
  svg {
    margin-right: 5px;
  }
`
const MENU_ITEMS = [
  {
    title: "Feed",
    path: "/",
    icon: faHouse,
  },
  // {
  //   title: "Login",
  //   path: "/auth/login",
  //   icon: faRightToBracket,
  // },
  // { title: "Register", path: "/auth/register", icon: faUserPen },
  { title: "Match", path: "/matcher", icon: faFireFlameCurved },
]

function renderRoute({ title, path, icon }) {
  return (
    <li>
      <FontAwesomeIcon icon={icon} />
      <Link to={path}>{title}</Link>
    </li>
  )
}

export default function NavBar({ username }) {
  const navigate = useNavigate()

  function signOut() {
    localStorage.clear("isLoggedIn")
    navigate("/auth/login")
  }

  return (
    <Layout>
      <Navigation>
        {MENU_ITEMS.map(renderRoute)}
        {renderRoute({
          title: username,
          path: `/profile/${username}`,
          icon: faUser,
        })}

        <li>
          <Button type="text" onClick={() => signOut()}>
            Log Out
          </Button>
        </li>
      </Navigation>
    </Layout>
  )
}
