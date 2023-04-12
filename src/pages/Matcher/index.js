import React from "react"
import styled from "styled-components"
import MatcherContextProvider from "../../services/matcherContext"
import MatchList from "./components/MatchList"
import UsersList from "./components/UsersList"

const Dashboard = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: calc(100vh - 60px);
`
export default function MemeMatcher() {
  return (
    <MatcherContextProvider>
      <Dashboard>
        <MatchList />
        <UsersList />
      </Dashboard>
    </MatcherContextProvider>
  )
}
