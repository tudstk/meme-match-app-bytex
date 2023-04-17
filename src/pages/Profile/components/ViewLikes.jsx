import React from "react"
import { useEffect, useState } from "react"
import { db, auth } from "../../../utils/firebase"

import { Button, Modal } from "antd"

export default function ViewLikes({ memeId, username }) {
  const [loggedUsername, setLoggedUsername] = useState("")
  const [likes, setLikes] = useState([])
  const [users, setUsers] = useState({})
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
    db.collection("memes")
      .doc(memeId)
      .onSnapshot((doc) => {
        setLikes(doc.data().likes)
      })
  }, [memeId])

  useEffect(() => {
    if (likes.length > 0) {
      db.collection("users")
        .where("userId", "in", likes)
        .get()
        .then((querySnapshot) => {
          const usersData = {}
          querySnapshot.forEach((doc) => {
            usersData[doc.data().userId] = doc.data().username
          })
          setUsers(usersData)
        })
        .catch((error) => {
          console.log("Error getting users:", error)
        })
    }
  }, [likes])

  return (
    <>
      <Button onClick={showModal}>View Likes</Button>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        centered={true}
      >
        <div>{likes.length} likes</div>
        {likes.map((uid) => (
          <div key={uid}>{users[uid]}</div>
        ))}
      </Modal>
    </>
  )
}
