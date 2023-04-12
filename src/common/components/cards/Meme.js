import React from "react"
import styled from "styled-components"

const Image = styled.div`
  height: 480px;
  background: url(${(props) => props.url});

  background-position: center;
  background-size: contain;
  background-color: white;
  background-repeat: no-repeat;
`

const Name = styled.div`
  font-size: 20px;
`

const Wrapper = styled.div`
  height: 100%;
  width: 450px;
  padding: 30px 20px;
  margin-bottom: 30px;
`

export default function Card({ id, name, url }) {
  return (
    <Wrapper key={id}>
      <Image url={url} />
      <Name>{name}</Name>
    </Wrapper>
  )
}
