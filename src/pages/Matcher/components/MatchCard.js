import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Avatar, Button } from "antd"
import React, { useCallback, useContext } from "react"
import styled from "styled-components"
import { MatcherContext } from "../../../services/matcherContext"
import { db } from "../../../utils/firebase"

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;

  button {
    margin-left: auto;
  }
`

export default function MatchCard({ userId, avatarUrl, username }) {
  const { documentId, userMatchIds } = useContext(MatcherContext)

  const deleteMatch = useCallback(
    (matchedUserId) => {
      const deleteMatchFromDB = async () => {
        db.collection("users")
          .doc(documentId)
          .update({
            matching: userMatchIds.filter((id) => id !== matchedUserId),
          })
      }
      deleteMatchFromDB()
    },
    [documentId, userMatchIds]
  )

  return (
    <Wrap key={userId}>
      <Avatar src={avatarUrl} alt={username} />
      <div>{username}</div>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrash} />}
        onClick={() => deleteMatch(userId)}
      />
    </Wrap>
  )
}
