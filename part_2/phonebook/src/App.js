import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Persons from './components/Persons'
import personService from './services/persons'
import './index.css'

const Filter = ({ filter, handleFilter }) =>
  <p>filter shown with <input value={filter} onChange={handleFilter}/></p>


const PersonForm = ({ submit, fields }) => {
  return (
    <form onSubmit={submit}>
      {fields.map(field => 
        <div key={field.name}>
          {field.name}: <input value={field.value} onChange={field.handler} />
        </div>
      )}
      <button type='submit'>add</button>
    </form>
  )}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [msg, setMsg] = useState(null)
  const [msgType, setMsgType] = useState(null)

  // Inital request and load data
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
         setPersons(initialPersons);
    })
  }, [])

  // Function for submitting form
  const addEntry = (event) => {
    event.preventDefault()
    
    // Check for repeating name & number
    let repeat = false;
    persons.forEach(person => {
      if (person.name === newName)
        repeat = true
    })

    // Alert if repeating, otherwise update data
    if (repeat) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        let updateId = persons.find(p => p.name === newName).id
        personService
          .update(
            updateId,
            {
              name: newName,
              number: newNumber
            })
          .then(updatedPerson =>
            setPersons(persons.filter(p => p.name !== newName).concat(updatedPerson))
            )
          .catch(() => {
            setMsg(`Information of ${newName} has already been removed from the server`)
            setMsgType('error')
            setTimeout(() => {
              setMsg()
              setMsgType()
            }, 5000)
          })
      }
    }
    else
      personService
        .add({
            name: newName,
            number: newNumber 
        })
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          // Reset fields
          setNewName('')
          setNewNumber('')
          setMsg(`Added ${returnedPerson.name}`)
          setMsgType('notif')
          setTimeout(() => {
            setMsg()
            setMsgType()
          }, 5000)
        })
  }

  // Update search field
  const handleFilter = (event) => 
    setFilter(event.target.value)

  // Update name field
  const handleNameChange = (event) =>
    setNewName(event.target.value)

  // Update number field
  const handleNumberChange = (event) =>
    setNewNumber(event.target.value)

  // Delete entry
  const handleDeleteOf = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(returnedPersons => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch()
        }
    }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={msg} type={msgType} />
      <Filter filter={newFilter} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm
        submit={addEntry}
        fields={[
          {
            name: 'name',
            value: newName,
            handler: handleNameChange
          },
          {
            name: 'number',
            value: newNumber,
            handler: handleNumberChange
          }
        ]}/>
      <h3>Numbers</h3>
      <Persons
        persons={
          persons.filter(person =>
            person.name.toUpperCase().includes(newFilter.toUpperCase()))}
        handleDeleteOf={handleDeleteOf}
      />
    </div>
  )
}
export default App;
