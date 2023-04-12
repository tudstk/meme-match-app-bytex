import React, { useCallback, useContext, useState } from "react"
import styled, { css } from "styled-components"
import { Card, Carousel, Image } from "antd"
import { db } from "../../../utils/firebase"
import { MatcherContext } from "../../../services/matcherContext"
import { faCircleXmark, faHeart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ProfileCard = styled(Card)`
  width: 510px;
  position: absolute;
  ${(props) =>
    props.isAdded &&
    css`
      transform: translate(2230px, -100px) rotate(-30deg);
      transition: all 800ms ease-out;
    `}

  ${(props) =>
    props.isRejected &&
    css`
      transform: translate(-2230px, -100px) rotate(30deg);
      transition: all 800ms ease-out;
    `}
`

const Details = styled.div`
  h3 {
    margin: 5px 0;
  }

  p {
    margin: 0px;
  }
`

const CardButton = styled.button`
  border-radius: 50%;
  padding: 18px;
  font-size: 30px;
  border: none;
`
const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 80px;
`

function MemeCarousel({ memes }) {
  return (
    <Carousel>
      {memes.length === 0 ? (
        <div style={{ height: "500px" }} />
      ) : (
        (memes || []).map((meme) => (
          <Image key={meme.imageUrl} src={meme.imageUrl} height={500} />
        ))
      )}
    </Carousel>
  )
}

export default function UserCard({ userId, username, description }) {
  const { memesByUser, documentId, userMatchIds } = useContext(MatcherContext)

  const [isRejected, setIsRejected] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const addMatch = useCallback(() => {
    const addMatchToDB = async () => {
      db.collection("users")
        .doc(documentId)
        .update({
          matching: [...userMatchIds, userId],
        })
    }
    setIsAdded(true)
    setTimeout(addMatchToDB, 800)
  }, [documentId, userMatchIds, userId])

  const buttons = [
    {
      id: "reject",
      icon: faCircleXmark,
      handleClick: () => setIsRejected(!isRejected),
    },
    {
      id: "add",
      icon: faHeart,
      handleClick: addMatch,
    },
  ]

  const renderButton = ({ id, icon, handleClick }) => {
    return (
      <CardButton key={id} onClick={handleClick}>
        <FontAwesomeIcon icon={icon} />
      </CardButton>
    )
  }

  return (
    <ProfileCard
      key={`profile-card-${userId}`}
      isAdded={isAdded}
      isRejected={isRejected}
    >
      <MemeCarousel memes={memesByUser?.[userId] || []} />

      <Details>
        <h3>{username}</h3>
        <p>{description}</p>
      </Details>
      <ButtonWrap>{buttons.map(renderButton)}</ButtonWrap>
    </ProfileCard>
  )
}
