import React from 'react'
import '../App.css';


type CatProps = {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setCat: React.Dispatch<React.SetStateAction<string>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setNamed: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>;
};

function Categories({showMenu, setShowMenu, setCat, setScore, setNamed}: CatProps) {
  
    const HandleSelection = (category: string) => 
  {
    setCat(category);
    setShowMenu(!showMenu);
    setScore(0);
    setNamed({});
  };

  return (
    <>
      <div className='selectionMenu'>
        <ul>
            <li><button onClick={() => {HandleSelection("People");}}>People</button></li>
            <li><button onClick={() => {HandleSelection("Men");}}>Men</button></li>
            <li><button onClick={() => {HandleSelection("Women");}}>Women</button></li>
        </ul>
      </div>
    </>
  )
}

export default Categories