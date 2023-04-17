import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useParams } from "react-router-dom"
import UploadAvatar from "./components/UploadAvatar"
import UpdateDescriptionModal from "./components/UpdateDescriptionModal"
import UploadMemeModal from "./components/UploadMemeModal"
import { Button, Modal, Input, Image } from "antd"
import { faComment } from "@fortawesome/free-solid-svg-icons"
import { auth, db } from "../../utils/firebase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ViewLikes from "./components/ViewLikes"
import DeleteMeme from "./components/DeleteMeme"

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
const ActionsWrap = styled.div`
  display: flex;

  & :not(:first-child) {
    margin-left: 8px;
  }
`

export default function Profile() {
  const [userDetails, setUserDetails] = useState({})
  const [userMemes, setUserMemes] = useState([])
  const { username } = useParams()
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
      .where("username", "==", username)
      .onSnapshot((snapshot) => {
        const currentUser = snapshot.docs[0]?.data()

        setUserDetails({
          description: currentUser?.description,
          avatarUrl: currentUser?.avatarUrl,
          username: currentUser?.username,
          documentId: snapshot.docs[0]?.id,
          userId: currentUser?.userId,
        })
      })
  }, [username])

  useEffect(() => {
    db.collection("memes").onSnapshot((snapshot) => {
      const filteredMemes = snapshot.docs.filter(
        (doc) => doc.data().username === username
      )
      setUserMemes(
        filteredMemes.map((meme) => ({ id: meme.id, ...meme.data() }))
      )
    })
  }, [username])

  const fetchComments = async (memeId) => {
    const querySnapshot = await db
      .collection("comments")
      .where("memeId", "==", memeId)
      .orderBy("timestamp", "asc")
      .get()
    const comments = querySnapshot.docs.map((doc) => doc.data())
    setComments(comments)
  }

  const renderMeme = (meme) => {
    return (
      <Card key={meme.id}>
        <Image width={250} height={250} src={meme.imageUrl} alt="" />
        <div>
          <Button
            onClick={() => {
              setCurrentMeme(meme)
              fetchComments(meme.id)
              showModal()
            }}
          >
            <FontAwesomeIcon icon={faComment} />
          </Button>
          <ViewLikes memeId={meme.id} username={userDetails?.username} />
          <DeleteMeme memeId={meme.id} username={userDetails?.username} />
        </div>
      </Card>
    )
  }

  return (
    <Content>
      <UserDetails>
        <StyledImage src={userDetails?.avatarUrl} />
        <Name>{userDetails?.username}</Name>
        <Description>{userDetails?.description}</Description>
        {auth.currentUser.uid === userDetails.userId && (
          <ActionsWrap>
            <UploadAvatar />
            <UpdateDescriptionModal
              documentId={userDetails?.documentId}
              currentDescription={userDetails?.description}
            />
            <UploadMemeModal />
          </ActionsWrap>
        )}
      </UserDetails>
      <CardsWrapper>{userMemes.map((meme) => renderMeme(meme))}</CardsWrapper>
      {currentMeme && (
        <>
          <Modal
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            centered={true}
          >
            <div>
              <div>
                {comments.map((comment) => (
                  <div key={comment.timestamp}>
                    <b>{comment.username}</b>
                    <p>{comment.comment}</p>
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
                    username: username,
                  })
                  setNewComment({ comment: "", userId: "" })
                  fetchComments(currentMeme.id)
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
