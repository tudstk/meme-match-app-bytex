import { Button, Modal } from "antd"
import React, { useState } from "react"
import { InboxOutlined } from "@ant-design/icons"
import { message, Upload } from "antd"
import { v4 as uuid } from "uuid"
import { auth, db, storage } from "../../../utils/firebase"

const { Dragger } = Upload

export default function UploadAvatar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const uploadProps = {
    fileList: file ? [file] : [],
    beforeUpload: (uploadedFile) => {
      // this is before upload
      setFile(uploadedFile)
      return false
    },
    onRemove: () => {
      setFile(null)
    },
  }

  function onSucces(imageUrl) {
    // on Success
    db.collection("users").onSnapshot((snapshot) => {
      const userRecord = snapshot.docs.find(
        (doc) => doc.data().userId === auth.currentUser?.uid
      )
      db.collection("users").doc(userRecord.id).update({
        avatarUrl: imageUrl,
      })
    })
  }

  function handleUpload() {
    const imageName = `${file.name}-${uuid()}`

    storage
      .ref(`avatars/${imageName}`)
      .put(file)
      .then((snapshot) => {
        if (snapshot.state === "success") {
          // update user avatarUrl
          storage
            .ref("avatars")
            .child(imageName)
            .getDownloadURL()
            .then(async (downloadUrl) => {
              await onSucces(downloadUrl)
              setIsModalOpen(false)
              setFile(null)
            })
        }
      })
      .catch((err) => message.error(`${imageName} could not be uploaded`))
  }

  const handleOk = () => {
    handleUpload()
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Upload Avatar
      </Button>
      <Modal
        title="Upload Avatar"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
      </Modal>
    </>
  )
}
