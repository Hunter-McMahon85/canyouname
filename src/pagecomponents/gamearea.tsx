import { SetStateAction, useState } from 'react'
import './App.css';

function GameArea() {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    console.log('Submitted value:', inputValue);
    // handle query here
    setInputValue(" ");
  };

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Cat_name"
      />
    </form>
    </>
  )
}

export default GameArea