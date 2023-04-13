import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { Button, Modal, Input, Image } from "antd"
import { db } from "../../../utils/firebase"

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
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        {comments.map((comment) => (
          <>
            <b key={comment.id}>{comment.username}</b>
            <p key={comment.id}>{comment.comment}</p>
          </>
        ))}
      </Modal>
    </Wrapper>
  )
}
