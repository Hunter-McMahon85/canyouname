import { SetStateAction, useState } from 'react'
import '../App.css';
import GameFunctions from './GameFunctions';
import queries from './Querys';

type GameFunctionsKey = keyof typeof GameFunctions;
type GameProps = {
  Cat: string;
};

function GameArea({Cat}: GameProps) {
  const [inputValue, setInputValue] = useState('');
  const [Score, setScore] = useState(0);
  const [SubStatus, setSubStatus] = useState("");
  const [Named, setNamed] = useState<Record<string, string>>({});
  const [Category] = useState<(input: string) => string>(() => queries.Gender);

  const endpointUrl = 'https://query.wikidata.org/sparql';
  

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
  };

  async function makeSPARQLQuery(
    endpointUrl: string,
    sparqlQuery: string
  ): Promise<any> {
    const url = `${endpointUrl}?query=${encodeURIComponent(sparqlQuery)}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/sparql-results+json',
      },
    });

    if (!response.ok) {
      throw new Error(`SPARQL query failed: ${response.statusText}`);
    }

    return await response.json();
  }

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    // console.log('Submitted value:', inputValue);
    // handle query here
    makeSPARQLQuery(endpointUrl, Category(inputValue))
      .then((data) => {
        console.log(data.results.bindings);
        if (data.results.bindings.length > 0) {
          const key = data.results.bindings[0].personLabel.value;
          const value = data.results.bindings[0].article.value;

          //console.log(Named);
          if (key in Named) {
            // duplicate name
            setSubStatus(`you have already named ${key}`)
          } else if (GameFunctions[Cat as GameFunctionsKey](data.results.bindings[0])) {
            // valid name; meets criteria
            setNamed(prev => ({ ...prev, [key]: value }));
            setScore(Score + 1);
            setSubStatus("")
          } else {
            // valid name; does not meet criteria
            setSubStatus(`${key} is not a ${Cat}`)
          }
        } else {
          // bad input/fictional person
          setSubStatus(`${inputValue}, is misspelled or fictional (Exclude Royal/formal Titles & verify capitalization).`)
        }
      })
      .catch((error) => {
        console.error('Query error:', error);
      });

    setInputValue("");
  };

  return (
    <>
      <h2>{Score}</h2>
      <p>Points given for each valid person named that matches the category. Note this is reliant on Wikidata entries thus each Pearson named must be real and have an english wikipedia page. Spelling and Capitalization matters<br/> <br/>click the underlined word above to change categories</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter Name"
        />
      </form>
      <p>{SubStatus}</p>
      <ul>
      {Object.entries(Named).map(([key, value]) => (
        <li key={key}>
          <a target="_blank" href={value}>{key}</a>
        </li>
      ))}
    </ul>
    </>
  )
}

export default GameArea