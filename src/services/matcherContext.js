import React, { createContext, useEffect, useState } from "react"
import { auth, db } from "../utils/firebase"

export const MatcherContext = createContext()

export default function MatcherContextProvider({ children }) {
  const [matchList, setMatchList] = useState([])
  const [userMatchIds, setUserMatchIds] = useState([])
  const [potentialMatches, setPotentialMatches] = useState([])
  const [memesByUser, setMemeByUser] = useState({})
  const [documentId, setDocumentId] = useState("")

  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) => {
      const allUsers = snapshot.docs.map((doc) => doc.data())
      const currentUserDetails = allUsers.find(
        (user) => user?.userId === auth?.currentUser?.uid
      )
      const currentUserDocumentId = snapshot.docs.find(
        (doc) => doc.data().userId === auth?.currentUser?.uid
      )?.id

      const userMatchesIds = currentUserDetails?.matching || []
      const filteredPotentialMatches = allUsers.filter(
        (user) => !userMatchesIds.includes(user.userId)
      )

      const currentMatches = allUsers.filter((user) =>
        userMatchesIds.includes(user.userId)
      )

      setUserMatchIds(userMatchesIds)
      setPotentialMatches(filteredPotentialMatches)
      setMatchList(currentMatches)
      setDocumentId(currentUserDocumentId)
    })
  }, [])

  useEffect(() => {
    db.collection("memes").onSnapshot((snapshot) => {
      const memes = snapshot.docs.map((doc) => doc.data())

      const filteredMemesByUser = potentialMatches.reduce((acc, curr) => {
        acc[curr.userId] = memes.filter((meme) => meme.userId === curr.userId)
        return acc
      }, {})

      setMemeByUser(filteredMemesByUser)
    })
  }, [potentialMatches])

  return (
    <MatcherContext.Provider
      value={{
        matchList,
        potentialMatches,
        userMatchIds,
        documentId,
        memesByUser,
      }}
    >
      {children}
    </MatcherContext.Provider>
  )
}
