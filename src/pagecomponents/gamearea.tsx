import { SetStateAction, useState } from 'react'
import '../App.css';
import GameFunctions from './GameFunctions';
import queries from './Querys';

type GameFunctionsKey = keyof typeof GameFunctions;
type GameProps = {
  Cat: string;
  Score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  Named: Record<string, Record<string, string>>;
  setNamed: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>;
};

function GameArea({Cat, Score, setScore, Named, setNamed}: GameProps) {
  const [inputValue, setInputValue] = useState('');
  const [SubStatus, setSubStatus] = useState("");
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
          const key = inputValue;
          if (key in Named) 
          {
              // duplicate name
              setSubStatus(`you have already named ${key}`)
              return;
          }

          const NewItems: Record<string, string> = {};
          for (var i =0; i < data.results.bindings.length; i++) 
          {
            const WikiPage = data.results.bindings[i].article.value;
            const Occupation = data.results.bindings[i].occupationLabel?.value || "Unknown Occupation";
            if ((GameFunctions[Cat as GameFunctionsKey](data.results.bindings[i])) && (!(WikiPage in NewItems))){
              // name meets criteria
              NewItems[WikiPage] = Occupation;
              setScore(prev => prev + 1);
              setSubStatus("")
            } else {
              // name does not meet criteria
              setSubStatus(`${key} is not a ${Cat}`)
            }
          }
          setNamed(prev => ({ ...prev, [key]: NewItems }));
        /*
          const key = data.results.bindings[0].personLabel.value;
          const value = data.results.bindings[0].article.value;
            //console.log(Named);
            if (key in Named) {
              // duplicate name
              setSubStatus(`you have already named ${key}`)
            } else if (GameFunctions[Cat as GameFunctionsKey](data.results.bindings[i])) {
              // name meets criteria
              setNamed(prev => ({ ...prev, [key]: value }));
              setScore(Score + 1);
              setSubStatus("")
            } else {
              // name does not meet criteria
              setSubStatus(`${key} is not a ${Cat}`)
            }
        */
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
      <p>Points awarded for each real person named matching the category; Spelling and capitalization matters; The person must also have an English Wikipedia page (this site uses SPARQL queries to check your responses)<br/> <br/>click the underlined word above to change categories</p>
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
      {Object.entries(Named).flatMap(([Name, Articles]) => Object.entries(Articles).map(([key, value]) => ({Name, key, value,}))).map(({ Name, key, value }) => (<li key={key}><a target="_blank" href={key}>{Name} - {value}</a></li>))}
    </ul>
    </>
  )
}

export default GameArea