import { Button, Input, Modal } from "antd"
import React, { useState, useEffect } from "react"
import { db } from "../../../utils/firebase"

export default function UpdateDescriptionModal({
  documentId,
  currentDescription,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [description, setDescription] = useState("")

  useEffect(() => {
    setDescription(currentDescription)
  }, [currentDescription])

  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
    db.collection("users").doc(documentId).update({
      description: description,
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit description
      </Button>
      <Modal
        title="Edit description"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          label="Description"
          placeholder="Description"
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
      </Modal>
    </>
  )
}
