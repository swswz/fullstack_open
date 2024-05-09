import axios from 'axios'
import {useState, useEffect} from 'react'

const Weather = ({ success, weather }) => {
  if (success) {
    return (
      <div>
        <p>Temperature is {(weather.main.temp - 273.15).toFixed(2)} °C</p>
        <img src={'http://openweathermap.org/img/wn/' + weather.weather[0].icon +'@2x.png'} />
        <p>Wind is {weather.wind.speed} m/s</p>
      </div>
    )
  } else
    return <p>Error fetching weather data</p>
}

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState()
  const [weatherSuccess, setWeatherSuccess] = useState(false)
  const api_key = process.env.REACT_APP_API_KEY
  let request = 'http://api.openweathermap.org/data/2.5/weather?q=' + country.capital +',' + country.cca2+ '&appid=' + api_key;

  useEffect(() => {
    axios
    .get(request)
    .then(response => {
      if (response.status === 200) {
        setWeather(response.data)
        setWeatherSuccess(true)
      }}
    )

  })

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {
          Object.keys(country.languages).map((lang, i) => (
            <li key={lang}>{country.languages[lang]}</li>
          ))
        }
      </ul>
      <img src={country.flags.png}></img>
      <h2>Weather in {country.capital}</h2>
      <Weather success={weatherSuccess} weather={weather} />
    </div>
  )
}



const Results = ({ selected, handleSelected, countries }) => {
  if (selected >= 0)
    return <CountryDetails country={countries[selected]} />
  else if (countries.length < 10) {
    return (
      <div>
        {
          countries.map((country, i) =>
            <p key={country.cca3}>{country.name.common} <button type="button" value={i} onClick={handleSelected}>show</button></p>
        )}
      </div>
    )
  } else
    return <div><p>Too many matches, specify another filter</p></div>
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [selected, setSelected] = useState(-1)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response =>
        setCountries(response.data)
      )
  }, [])

  const handleSelected = (event) =>
    setSelected(event.target.value)



  const handleSearchChange = (event) => {
    if (selected !== -1)
      setSelected(-1)
      
    setSearch(event.target.value)
    setSearchResults(countries.filter(country => 
      country.name.common.toUpperCase().includes(search.toUpperCase())))
  }

  return (
    <div>
      <form>
        find countries
        <input onChange={handleSearchChange} value={search}/>
      </form>
      <Results selected={selected} handleSelected={handleSelected} countries={searchResults} />
    </div>
  );
}

export default App;
