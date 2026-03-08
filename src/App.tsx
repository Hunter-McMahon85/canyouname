import { useState } from 'react'
import './App.css';
import GameArea from './pagecomponents/gamearea';
import Categories from './pagecomponents/Categories';

function App() {
  const [Cat, setCat] = useState("People");
  const [showMenu, setShowMenu] = useState(false);

  const OpenSelections = () => 
  {
    setShowMenu(!showMenu);
  };
  return (
    <>
      <div className='MainContain'>
        <h1>How Many <button className='category_select' onClick={OpenSelections}><b><u>{Cat}</u></b></button> Can You Name?</h1>
        {showMenu && (
          <Categories showMenu={showMenu} setShowMenu={setShowMenu} setCat={setCat} />
        ) }
        <GameArea Cat={Cat} />
      </div>
      <footer>
        <a target="_blank" href="https://buymeacoffee.com/hunteram85">Support Me!</a>
      </footer>
    </>
  )
}

export default App
