import { SetStateAction, useState } from 'react'
import '../App.css';

function GameArea() {
  const [inputValue, setInputValue] = useState('');
  const [Score, setScore] = useState(0);
  const [NamesDisplay, setNamesDisplay] = useState(<ul></ul>);
  const [Named, setNamed] = useState<Record<string, string>>({});

  const endpointUrl = 'https://query.wikidata.org/sparql';
  const sparqlQuery = `
    SELECT DISTINCT ?person ?personLabel ?article WHERE {
      ?person rdfs:label "${inputValue}"@en.
      ?person wdt:P31 wd:Q5;
              wdt:P21 wd:Q6581072;
              wdt:P569 ?dob.
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
          // score one point, add to the list of people named
          const key = data.results.bindings[0].personLabel.value;
          const value = data.results.bindings[0].article.value;

          console.log(Named);
          if (key in Named) {
          } else {
            setNamed(prev => ({ ...prev, [key]: value }));
            setScore(Score + 1);
          }
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Cat_name"
        />
      </form>
      <ul>
      {Object.entries(Named).map(([key, value]) => (
        <li key={key}>
          <a href={value}>{key}</a>
        </li>
      ))}
    </ul>
    </>
  )
}

export default GameArea