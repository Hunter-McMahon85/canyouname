import { useState } from 'react'
import './App.css';
import GameArea from './pagecomponents/gamearea';

function App() {
  const [Cat] = useState("Women");

  return (
    <>
      <h1>How Many {Cat} Can You Name?</h1>
      <p>Provided they have a wikipedia page</p>
      <GameArea></GameArea>
    </>
  )
}

export default App

// page format:
// title, hovering over blankspace (cat is placeover), will bring category drop down menu -> this should be an component
// whitespace below, in this section is the game area, text box for input and score, below will be list of people named by the player
// text input box and scorecard should be a component. queries should be imported from a list of someform