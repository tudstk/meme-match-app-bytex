import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Button, Modal, Input, Image } from "antd"
import { db, auth } from "../../../utils/firebase"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons"
import ViewLikes from "../../../pages/Profile/components/ViewLikes"

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
  const [newComment, setNewComment] = useState({ comment: "", userId: "" })
  const [loggedUsername, setLoggedUsername] = useState("")

  const [likes, setLikes] = useState([])

  useEffect(() => {
    const unsubscribe = db
      .collection("memes")
      .doc(id)
      .onSnapshot((doc) => {
        setLikes(doc.data().likes)
      })
    return () => unsubscribe()
  }, [id])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const addLike = async (memeId) => {
    const memeRef = db.collection("memes").doc(memeId)
    const memeDoc = await memeRef.get()
    const likedUsers = memeDoc.data().likes

    if (likedUsers.includes(auth.currentUser.uid)) {
      const updatedLikes = likedUsers.filter(
        (userId) => userId !== auth.currentUser.uid
      )
      await memeRef.update({ likes: updatedLikes })
    } else {
      const updatedLikes = [...likedUsers, auth.currentUser.uid]
      await memeRef.update({ likes: updatedLikes })
    }
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
      <Link to={`/${name}`}>
        <span>{name}</span>
      </Link>

      <StyledImage url={url} />
      <Button
        onClick={() => {
          fetchComments(id)
          showModal()
        }}
      >
        <FontAwesomeIcon icon={faComment} />
      </Button>
      <Button
        onClick={() => {
          addLike(id)
        }}
      >
        <FontAwesomeIcon icon={faHeart} />
        {likes.length}
      </Button>
      <ViewLikes memeId={id} username={loggedUsername} />
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
