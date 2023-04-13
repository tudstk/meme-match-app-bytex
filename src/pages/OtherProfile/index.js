import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import { db, auth } from "../../utils/firebase"
import { Button, Modal, Input, Image } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons"

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
  const [commentToAdd, setCommentToAdd] = useState("")

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
  })

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
    return (
      <Card key={meme.id}>
        <Modal
          title="Comments"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Input
            placeholder="Your comment here..."
            onChange={(event) => setCommentToAdd(event.target.value)}
          />
          <Button>Submit comment</Button>
        </Modal>
        <Image width={250} height={250} src={meme.imageUrl} />
        <Button onClick={showModal}>
          <FontAwesomeIcon icon={faComment} />
        </Button>
      </Card>
    )
  }

  return (
    <Content>
      <UserDetails>
        <StyledImage src={userDetails?.avatarUrl} alt={userDetails?.username} />
        <Name>{userDetails?.username || "-"}</Name>
        <Description>{userDetails?.description || "-"}</Description>
      </UserDetails>
      <CardsWrapper>
        {userMemes.length === 0 ? (
          <span>You do not have uploaded memes yet</span>
        ) : (
          userMemes.map(renderMeme)
        )}
      </CardsWrapper>
    </Content>
  )
}
