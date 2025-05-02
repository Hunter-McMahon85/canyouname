import { SetStateAction, useState } from 'react'
import '../App.css';

function GameArea() {
  const [inputValue, setInputValue] = useState('');
  const [Score, setScore] = useState(0);
  const [SubStatus, setSubStatus] = useState("");
  const [Named, setNamed] = useState<Record<string, string>>({});

  const endpointUrl = 'https://query.wikidata.org/sparql';
  const sparqlQuery = `
    SELECT DISTINCT ?person ?personLabel ?article ?personSexLabel WHERE {
      ?person rdfs:label "${inputValue}"@en;
        wdt:P31 wd:Q5;
        wdt:P21 ?personSex.
      ?article schema:about ?person;
        schema:isPartOf <https://en.wikipedia.org/>.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} 
  `;

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
    console.log('Submitted value:', inputValue);
    // handle query here
    makeSPARQLQuery(endpointUrl, sparqlQuery)
      .then((data) => {
        // scoring logic + addition of data to list
        console.log(data.results.bindings);
        if (data.results.bindings.length > 0) {
          
          const key = data.results.bindings[0].personLabel.value;
          const value = data.results.bindings[0].article.value;
          const g = data.results.bindings[0].personSexLabel.value;


          console.log(Named);
          if (key in Named) {
            // duplicate name
            setSubStatus(`you have already named ${key}`)
          } else if (g == 'female' || g == 'trans woman') {
            // score one point, add to the list of people named
            setNamed(prev => ({ ...prev, [key]: value }));
            setScore(Score + 1);
            setSubStatus("")
          } else {
            setSubStatus(`${key} is ${g}`)
          }
        } else {
          // bad input/fictional person
          setSubStatus(`${inputValue}, is either misspelled or fictional (Exclude Titles and ensure proper capitalization).`)
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
      <p>To earn points, each woman you name needs to be real and have a Wikipedia page about them. The name must match to the wikipedia page title (Case Sensitive)</p>
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