import React, { useContext } from "react"
import styled from "styled-components"
import { MatcherContext } from "../../../services/matcherContext"
import MatchCard from "./MatchCard"

const List = styled.div`
  border-right: 1px solid black;
`

const Title = styled.div`
  text-align: center;
  width: 300px;
  padding: 30px 0px;
  border-bottom: 1px solid;
  font-weight: 600;
`

const NoMatches = styled.div`
  text-align: center;
  padding: 20px;
`
const Reverse = styled.div`
  display: flex;
  flex-flow: column-reverse;
`

export default function MatchList() {
  const { matchList } = useContext(MatcherContext)

  function renderMatch(match, index) {
    return <MatchCard key={`match-${index}`} {...match} />
  }

  return (
    <List>
      <Title>Here are your matches</Title>
      {matchList.length === 0 ? (
        <NoMatches>You have no matches yet</NoMatches>
      ) : (
        <Reverse>{matchList.map(renderMatch)}</Reverse>
      )}
    </List>
  )
}
