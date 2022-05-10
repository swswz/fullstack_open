import { useState } from 'react'

const Button = ({clickHandler, text}) => <button onClick={clickHandler}>{text}</button>

const StatisticsLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
    )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad

  if (total === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  else {
    const avg = ((good - bad) / total).toFixed(1)
    const positive = (100 * good / total).toFixed(1).toString().concat('%')
    
    return (
      <div>
        <h1>statistics</h1>
        <table>
          <tbody>
            <StatisticsLine text='good' value={good} />
            <StatisticsLine text='neutral' value={neutral} />
            <StatisticsLine text='bad' value={bad} />
            <StatisticsLine text='all' value={total} />
            <StatisticsLine text='average' value={avg} />
            <StatisticsLine text='positive' value={positive} />
          </tbody>
        </table>
      </div>
    )
  }
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const clickHandler = (text) => {
    if (text === 'good')
      return () => setGood(good + 1)
    else if (text === 'neutral')
      return () => setNeutral(neutral + 1)
    else if (text === 'bad')
      return () => setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button text='good' clickHandler={clickHandler('good')}/>
      <Button text='neutral' clickHandler={clickHandler('neutral')}/>
      <Button text='bad' clickHandler={clickHandler('bad')}/>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
