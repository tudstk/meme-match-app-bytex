import React, { useEffect, useState } from "react"
import Card from "../../common/components/cards/Meme"
import styled from "styled-components"
import { db } from "../../utils/firebase"
import { Button, Input } from "antd"
import { Link, useNavigate } from "react-router-dom"

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
`
const Search = styled.div`
  display: flex;
  flex-direction: column;
`

function Home() {
  const [memes, setMemes] = useState(null)
  const [inputText, setInputText] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    async function getMemes() {
      const snapshot = await db.collection("memes").get()
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setMemes(data)
    }

    getMemes()
  }, [])

  const navigateToProfile = async () => {
    const usersRef = db.collection("users")
    const querySnapshot = await usersRef
      .where("username", "==", inputText)
      .get()
    if (!querySnapshot.empty) {
      navigate(`/${inputText}`)
    } else {
      alert("User not found")
    }
  }

  return (
    <>
      <Wrap>
        <Search>
          <Input
            label="Find User"
            placeholder="Find user..."
            onChange={(event) => {
              setInputText(event.target.value)
            }}
          />
          <Button onClick={navigateToProfile}>Go to profile</Button>
        </Search>
        {memes &&
          memes.map((meme) => (
            <Card
              key={meme.id}
              url={meme.imageUrl}
              name={meme.username}
              id={meme.id}
            />
          ))}
      </Wrap>
    </>
  )
}

export default Home
