import React from 'react'

const Header = ({ course }) =>
  <h1>{course}</h1>

const Content = ({ parts }) => {
  return (
    <div>{
      parts.map(part => 
      <Part key={part.id} part={part} />)
      }
    </div>
  )
}

const Part = (props) => {
  console.log(props.part.name, props.part.exercises)
  return <p>{props.part.name} {props.part.exercises}</p>
}

const Total = ({ parts }) => {
  let count = parts.map(part => part.exercises)
  let sum = count.reduce((previous, next) => previous + next)
  return <p><strong>total of {sum} exercises</strong></p>
}



const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course