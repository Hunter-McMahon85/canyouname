import React from 'react'
import '../App.css';

type CatProps = {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setCat: React.Dispatch<React.SetStateAction<string>>;
};

function Categories({showMenu, setShowMenu, setCat}: CatProps) {
  
    const HandleSelection = (category: string) => 
  {
    setCat(category);
    setShowMenu(!showMenu);
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