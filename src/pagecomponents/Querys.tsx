const queries = {
    "Gender": (inputValue: string) => `SELECT DISTINCT ?person ?personLabel ?article ?occupationLabel ?personSexLabel WHERE {
                    ?person rdfs:label "${inputValue}"@en;
                        wdt:P31 wd:Q5;
                        wdt:P21 ?personSex;
                        wdt:P106 ?occupation.
                    ?article schema:about ?person;
                        schema:isPartOf <https://en.wikipedia.org/>.
                SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }}`
}

export default queries