import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='bg-dark text-light p-3 footer'>
      <h4>All Rights reserved &copy; lucky_products</h4>
      <div className='foot'>
        <Link to="/about" className='flink'>About</Link>|
        <Link to="/policy" className='flink'>Privacy And Policy</Link>|
        <Link to="/contact" className='flink'>Contact Us</Link>
      </div>
    </div>
  )
}

export default Footer
