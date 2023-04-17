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
const Search = styled.div`
  display: flex;
  flex-direction: column;
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
    <>
      <Wrap>
        <Search>
          <label htmlFor="find-user">Find a user</label>
          <input placeholder="Find user..." id="find-user" />
          <button>Go to profile</button>
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
