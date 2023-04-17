import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Button, Modal, Input, Image } from "antd"
import { db, auth } from "../../../utils/firebase"

const StyledImage = styled.div`
  height: 480px;
  background: url(${(props) => props.url});

  background-position: center;
  background-size: contain;
  background-color: white;
  background-repeat: no-repeat;
`

const Wrapper = styled.div`
  height: 100%;
  width: 450px;
  padding: 30px 20px;
  margin-bottom: 30px;
`

export default function Card({ id, name, url }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comments, setComments] = useState([])
  const [currentMeme, setCurrentMeme] = useState(null)
  const [newComment, setNewComment] = useState({ comment: "", userId: "" })
  const [loggedUsername, setLoggedUsername] = useState("")

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const fetchComments = async (memeId) => {
    const querySnapshot = await db
      .collection("comments")
      .where("memeId", "==", memeId)
      .orderBy("timestamp", "asc")
      .get()
    const comments = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((comment) => comment.memeId !== undefined)
    setComments(comments)
  }
  useEffect(() => {
    db.collection("users")
      .where("userId", "==", newComment.userId)
      .onSnapshot((snapshot) => {
        setLoggedUsername(snapshot.docs[0]?.data().username)
        console.log(loggedUsername)
      })
  })
  return (
    <Wrapper key={id}>
      <span>{name}</span>

      <StyledImage url={url} />
      <Button
        onClick={() => {
          fetchComments(id)
          showModal()
        }}
      >
        Show comments
      </Button>
      <Modal
        title="Comments"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <div>
          {comments.map((comment) => (
            <>
              <b key={comment.id}>{comment.username}</b>
              <p key={comment.id}>{comment.comment}</p>
            </>
          ))}
          <Input
            placeholder="Add comment"
            value={newComment.comment}
            onChange={(e) =>
              setNewComment({
                ...newComment,
                comment: e.target.value,
                userId: auth.currentUser.uid,
                username: loggedUsername,
              })
            }
          />
          <Button
            onClick={() => {
              console.log(loggedUsername)
              db.collection("comments").add({
                comment: newComment.comment,
                memeId: id,
                userId: newComment.userId,
                timestamp: new Date(),
                username: loggedUsername,
              })
              setNewComment({ comment: "", userId: "" })
              fetchComments(id)
            }}
          >
            Add Comment
          </Button>
        </div>
      </Modal>
    </Wrapper>
  )
}
