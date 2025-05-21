import React from 'react'
import { useNavigate } from 'react-router-dom'

const PagenotFound = () => {
  let navigate=useNavigate()
  let fun=()=>{
    navigate("/")
  }
  return (
    <div className='pnf'>
      <h1 style={{"fontWeight":"bold"}}>404</h1>
      <h1>Oops! Page not Found</h1>
      <button onClick={fun}>Back</button>
    </div>
  )
}

export default PagenotFound
