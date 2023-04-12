import React, { useEffect, useState } from "react"
import Card from "../../common/components/cards/Meme"
import styled from "styled-components"

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
`

function renderMemes(meme) {
  return <Card id={meme.id} url={meme.url} name={meme.name} />
}

function Home() {
  const [memes, setMemes] = useState([])

  useEffect(() => {
    async function getMemes() {
      const response = await fetch("https://api.imgflip.com/get_memes")
      const result = await response.json()

      setMemes(result?.data?.memes)
    }

    getMemes()
  }, [])

  return <Wrap>{memes.length !== 0 && memes.map(renderMemes)}</Wrap>
}

export default Home
