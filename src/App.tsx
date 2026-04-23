import { useState, useRef, useEffect } from 'react'
import './App.css';
import GameArea from './pagecomponents/gamearea';
import Categories from './pagecomponents/Categories';

function App() {
  const [Cat, setCat] = useState("People");
  const [showMenu, setShowMenu] = useState(false);
  const [Score, setScore] = useState(0);
  const [Named, setNamed] = useState<Record<string, string>>({});
  const menuRef = useRef<HTMLSpanElement | null>(null);

  const OpenSelections = () => 
  {
    setShowMenu(!showMenu);
  };

  //closes selection menu for clicks outside anywhere outside of its div
  useEffect(() => 
  {
    const handleClickOutside = (event: MouseEvent) => 
    {
      if (showMenu && menuRef.current && !menuRef.current.contains(event.target as Node)) 
      {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {document.removeEventListener("mousedown", handleClickOutside);};
  }, [showMenu]);

  return (
    <>
      <div className='MainContain'>
        <h1>How Many {" "}
          <span ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
            <button className='category_select' onClick={OpenSelections}><b><u>{Cat}</u></b></button>
              {showMenu && (<div style={{ position: "absolute", top: "100%", left: 0 }}><Categories showMenu={showMenu} setShowMenu={setShowMenu} setCat={setCat} setScore={setScore} setNamed={setNamed}/></div>)}
          </span>{" "}Can You Name?</h1>
        <GameArea Cat={Cat} Score={Score} setScore={setScore} Named={Named} setNamed={setNamed} />
      </div>
      <footer>
        <a target="_blank" href="https://buymeacoffee.com/hunteram85">Support Me!</a>
      </footer>
    </>
  )
}

export default App
