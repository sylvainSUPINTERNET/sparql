import React from 'react';
import logo from './logo.svg';
import './App.css';
import {SPARQLQueryDispatcher} from "./SPARQLQueryDispatcher";

//Wikidata:SPARQL query service/queries/examples - Wikidata
//https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/queries/examples

function App() {
  const [name, setName] = React.useState();
  const [firstname, setFirstname] = React.useState();
  const [list, setList] = React.useState();

  const onSubmitForm = (ev) => {
    ev.preventDefault();

    console.log("on submit");
    console.log(name);
    console.log(firstname);

    if(name.trim().length > 0 && firstname.trim().length > 0) {
      const endpointUrl = 'https://query.wikidata.org/sparql';
      const sparqlQuery = `SELECT DISTINCT ?country  ?countryLabel ?countryDescription ?population ?capital ?capitalLabel ?geo
{
    

  # toute les instance of / sub class de city = city avec une population minimal
  ?country wdt:P31 wd:Q3624078;
  wdt:P1082 ?population; # population$
  wdt:P36 ?capital;
  wdt:P3896 ?geo;
  
  #not a former country
  FILTER NOT EXISTS {?country wdt:P31 wd:Q3024240}
  #and no an ancient civilisation (needed to exclude ancient Egypt)
  FILTER NOT EXISTS {?country wdt:P31 wd:Q28171280}
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],fr". }

}
ORDER BY DESC(?population) LIMIT 10

`;
      const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
      queryDispatcher.query( sparqlQuery ).then( (response) => {
        console.log(response);
      } );

    } else {
      alert("Name / Firstname cannot be empty")
    }

  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="container">
          <h2 className="m-4">Search children !</h2>
          <form onSubmit={onSubmitForm}>
            <div className="form-group">
              <input type="text" placeholder="Name" onChange={(ev) => { setName(ev.target.value)} }/>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Firstname" onChange={(ev) => { setFirstname(ev.target.value)} }/>
            </div>
            <button type="btn" className="btn-md btn-success">Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
