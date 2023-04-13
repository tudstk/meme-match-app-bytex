import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import { db, auth } from "../../utils/firebase"
import { Button, Modal, Input, Image } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment } from "@fortawesome/free-solid-svg-icons"

const Content = styled.div`
  max-width: 880px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`

const UserDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid lightgrey;
  padding: 20px;
`

const StyledImage = styled.img`
  height: 180px;
  width: 180px;
  border-radius: 50%;
`

const Card = styled.div`
  height: 250px;
  width: 250px;
  margin-right: 20px;

  img {
    width: 100%;
    object-fit: contain;
  }

  :nth-child(3n + 3) {
    margin-right: 0;
  }

  img:hover {
    cursor: pointer;
    opacity: 0.3;
  }
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
`

const CardsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 20px;
  margin-bottom: 5rem;
`

const Name = styled.div`
  font-size: 30px;
`
const Description = styled.div`
  font-size: 18px;
  margin: 10px 0px;
  margin-bottom: 30px;
`

export default function OtherProfile() {
  const { user } = useParams()
  const [userDetails, setUserDetails] = useState({})
  const [userMemes, setUserMemes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMeme, setCurrentMeme] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ comment: "", userId: "" })

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    db.collection("users")
      .where("username", "==", user)
      .onSnapshot((snapshot) => {
        const currentUser = snapshot.docs[0]?.data()

        setUserDetails({
          description: currentUser?.description,
          avatarUrl: currentUser?.avatarUrl,
          username: currentUser?.username,
          documentId: snapshot.docs[0]?.id,
        })
      })
  }, [])

  useEffect(() => {
    db.collection("memes").onSnapshot((snapshot) => {
      const filteredMemes = snapshot.docs.filter(
        (doc) => doc.data().username === user
      )

      setUserMemes(
        filteredMemes.map((meme) => ({ id: meme.id, ...meme.data() }))
      )
    })
  }, [])

  const renderMeme = (meme) => {
    const fetchComments = async (memeId) => {
      const querySnapshot = await db
        .collection("comments")
        .where("memeId", "==", memeId)
        .orderBy("timestamp", "asc")
        .get()
      const comments = querySnapshot.docs.map((doc) => doc.data())
      setComments(comments)
    }

    return (
      <Card key={meme.id}>
        <Image width={250} height={250} src={meme.imageUrl} alt="" />
        <Button
          onClick={() => {
            setCurrentMeme(meme)
            fetchComments(meme.id)
            showModal()
          }}
        >
          <FontAwesomeIcon icon={faComment} />
        </Button>
      </Card>
    )
  }
  const Comments = ({ comments }) => {
    return (
      <div>
        {comments.map((comment) => (
          <div key={comment.timestamp}>
            <p>{comment.comment}</p>
            <p>by {comment.userId}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Content>
      <UserDetails>
        <StyledImage src={userDetails?.avatarUrl} />
        <Name>{userDetails?.username}</Name>
        <Description>{userDetails?.description}</Description>
      </UserDetails>
      <CardsWrapper>{userMemes.map((meme) => renderMeme(meme))}</CardsWrapper>
      {currentMeme && (
        <>
          <Modal
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            centered={true}
          >
            <div>
              <div>
                {comments.map((comment) => (
                  <div key={comment.timestamp}>
                    <p>{comment.comment}</p>
                    <p>by {comment.userId}</p>
                  </div>
                ))}
              </div>
              <Input
                placeholder="Add comment"
                value={newComment.comment}
                onChange={(e) =>
                  setNewComment({
                    ...newComment,
                    comment: e.target.value,
                    userId: auth.currentUser.uid,
                  })
                }
              />
              <Button
                onClick={() => {
                  db.collection("comments").add({
                    comment: newComment.comment,
                    memeId: currentMeme.id,
                    userId: newComment.userId,
                    timestamp: new Date(),
                  })
                  setNewComment({ comment: "", userId: "" })
                }}
              >
                Add Comment
              </Button>
            </div>
          </Modal>
        </>
      )}
    </Content>
  )
}
