import React, { useEffect, useState } from "react"
import Card from "../../common/components/cards/Meme"
import styled from "styled-components"
import { db } from "../../utils/firebase"

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
`

function Home() {
  const [memes, setMemes] = useState(null)

  useEffect(() => {
    async function getMemes() {
      const snapshot = await db.collection("memes").get()
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setMemes(data)
    }

    getMemes()
  }, [])

  return (
    <Wrap>
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
  )
}

export default Home
