import { useState } from 'react'
import './App.css';
import GameArea from './pagecomponents/gamearea';

function App() {
  const [Cat] = useState("Women");

  return (
    <>
      <div className='MainContain'>
        <h1>How Many {Cat} Can You Name?</h1>
        <GameArea></GameArea>
      </div>
      <footer>
        <a target="_blank" href="https://buymeacoffee.com/hunteram85">Support Me!</a>
      </footer>
    </>
  )
}

export default App

// page format:
// title, hovering over blankspace (cat is placeover), will bring category drop down menu -> this should be an component
// whitespace below, in this section is the game area, text box for input and score, below will be list of people named by the player
// text input box and scorecard should be a component. queries should be imported from a list of someform