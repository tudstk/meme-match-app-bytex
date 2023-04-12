import React, { useContext } from "react"
import styled from "styled-components"
import { MatcherContext } from "../../../services/matcherContext"
import UserCard from "./UserCard"

const Users = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  h2 {
    margin-bottom: 60px;
  }
`

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
`
export default function UsersList() {
  const { potentialMatches } = useContext(MatcherContext)

  function renderUserCard(user, index) {
    return <UserCard key={`userCard-${index}`} {...user} />
  }
  return (
    <Users>
      <h2>Find your Meme Match</h2>
      <Wrap>{potentialMatches.map(renderUserCard)}</Wrap>
    </Users>
  )
}
