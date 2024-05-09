const Persons = ({ persons, handleDeleteOf }) => {
  
  return (
    persons.map(person =>
      <p key={person.name}>{person.name} {person.number}
        <button onClick={() => handleDeleteOf(person.id)}>delete</button>
      </p>
    )
  )
}

export default Persons