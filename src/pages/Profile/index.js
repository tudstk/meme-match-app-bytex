import React, { useEffect, useState } from "react"
import styled from "styled-components"

import UploadAvatar from "./components/UploadAvatar"
import UpdateDescriptionModal from "./components/UpdateDescriptionModal"
import UploadMemeModal from "./components/UploadMemeModal"

import { auth, db } from "../../utils/firebase"

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

const Image = styled.img`
  height: 180px;
  width: 180px;
  border-radius: 50%;
`

const Card = styled.div`
  height: 350px;
  width: 250px;
  border-radius: 10px;
  margin-right: 20px;

  img {
    width: 100%;
    object-fit: contain;
  }

  :nth-child(3n + 3) {
    margin-right: 0;
  }
`

const CardsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 20px;
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
  // get user details
  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) => {
      const currentUser = snapshot.docs.find(
        (doc) => doc.data()?.userId === auth?.currentUser?.uid
      )

      setUserDetails({
        description: currentUser.data().description,
        avatarUrl: currentUser.data().avatarUrl,
        username: currentUser.data().username,
        documentId: currentUser.id,
      })
    })
  }, [])

  // get user memes
  useEffect(() => {
    db.collection("memes").onSnapshot((snapshot) => {
      const filteredMemes = snapshot.docs.filter(
        (doc) => doc.data().userId === auth.currentUser?.uid
      )

      setUserMemes(
        filteredMemes.map((meme) => ({ id: meme.id, ...meme.data() }))
      )
    })
  }, [])

  const renderMeme = (meme) => {
    return (
      <Card key={meme.id}>
        <img src={meme.imageUrl} alt={meme.imageUrl} />
      </Card>
    )
  }

  return (
    <Content>
      <UserDetails>
        <Image src={userDetails?.avatarUrl} alt={userDetails?.username} />
        <Name>{userDetails?.username || "-"}</Name>
        <Description>{userDetails?.description || "-"}</Description>
        <ActionsWrap>
          <UploadAvatar />
          <UpdateDescriptionModal
            documentId={userDetails?.documentId}
            currentDescription={userDetails?.description}
          />
          <UploadMemeModal />
        </ActionsWrap>
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
