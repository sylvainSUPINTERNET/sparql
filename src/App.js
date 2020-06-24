import React from 'react';
import {Bar, Line} from 'react-chartjs-2';
import './App.css';

import {SPARQLQueryDispatcher} from "./SPARQLQueryDispatcher";

//Wikidata:SPARQL query service/queries/examples - Wikidata
//https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/queries/examples


function App() {
  const [name, setName] = React.useState();
  const [list, setList] = React.useState();

  const [data, setData] = React.useState({});
  const [options, setOptions] = React.useState({});

  // Similaire à componentDidMount et componentDidUpdate :
  React.useEffect(() => {});

  const onSubmitForm = (ev) => {

    ev.preventDefault();
    name.charAt(0).toUpperCase()
    console.log("on submit");
    console.log(name);

    if(typeof name !== "undefined") {
      if(name.trim().length > 0) {
        const endpointUrl = 'https://query.wikidata.org/sparql';
        const sparqlQuery = `SELECT DISTINCT ?country ?countryLabel ?population ?totalCityPopulation ?geo ?flag ?imgFlag ?label{
    SERVICE wikibase:label { bd:serviceParam wikibase:language "fr" }
  
  ?country rdfs:label ?label .
  FILTER(LANG(?label) IN ("fr")).
  FILTER CONTAINS(?label, "${name}").
  ?country wdt:P1082 ?population .
  ?country wdt:P3896 ?geo .
  ?country wdt:P163  ?flag .
  ?flag wdt:P18 ?imgFlag .
  
  FILTER NOT EXISTS {?country wdt:P31 wd:Q28171280}
  FILTER NOT EXISTS {?country wdt:P31 wd:Q3024240}

  {
    SELECT ?country (SUM(?cityPopulation) AS ?totalCityPopulation) WHERE {
      ?city wdt:P31 wd:Q515 .
      ?city wdt:P17 ?country .
      ?city wdt:P1082 ?cityPopulation .
    } GROUP BY ?country

  }
} ORDER BY DESC(?population) LIMIT 1`;
        const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
        queryDispatcher.query( sparqlQuery ).then( (response) => {
          console.log(response);
          const {value} = response.results.bindings[0].population;
          const valCity = response.results.bindings[0].totalCityPopulation.value;
          console.log(value)
          console.log(valCity);
          setData({
            /*labels: ['January', 'February', 'March',
              'April', 'May'],*/
            datasets: [
              {
                label: 'Population total',
                fill: false,
                lineTension: 0.5,
                backgroundColor: '#FF0000',
                borderColor: '#B22222',
                borderWidth: 2,
                data: [value]
              },
              {
                label: 'Population cities',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: '#808080',
                borderWidth: 2,
                data: [valCity]
              }
            ]
          })
        } );

        setOptions({
          title:{
            display:true,
            text:`City population in ${name}`,
            fontSize:20
          },
          legend:{
            display:true,
            position:'right'
          }
        })

      } else {
        alert("Name cannot be empty")
      }
    } else {
      alert("Name cannot be empty")
    }


  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="container">
          <h2 className="m-4">Country population</h2>
          <form onSubmit={onSubmitForm}>
            <div className="form-group">
              <input type="text" placeholder="Country's name" onChange={(ev) => { setName(ev.target.value)} }/>
            </div>
            <button type="btn" className="btn-md btn-success">Search
            </button>
          </form>
          <Bar
              data={data}
              width={50}
              height={10}
              options={{ maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
