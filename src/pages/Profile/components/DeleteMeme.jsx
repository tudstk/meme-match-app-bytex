import React, { useState, useEffect } from "react"
import { Button, Modal } from "antd"
import { db } from "../../../utils/firebase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

export default function DeleteMeme({ memeId, username }) {
  const [userMemes, setUserMemes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    db.collection("memes").onSnapshot((snapshot) => {
      const filteredMemes = snapshot.docs.filter(
        (doc) => doc.data().username === username
      )
      setUserMemes(
        filteredMemes.map((meme) => ({ id: meme.id, ...meme.data() }))
      )
    })
  }, [])

  const handleDeleteMeme = async () => {
    try {
      await db.collection("memes").doc(memeId).delete()
      setUserMemes(userMemes.filter((meme) => meme.id !== memeId))
    } catch (error) {
      console.error("Error deleting meme", error)
    }
  }

  return (
    <>
      <Button danger={true} onClick={showModal}>
        <FontAwesomeIcon icon={faTrash} />
      </Button>
      <Modal
        title="Are you sure you want to delete this meme?"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Button danger={true} onClick={handleDeleteMeme}>
          Delete
        </Button>
      </Modal>
    </>
  )
}
