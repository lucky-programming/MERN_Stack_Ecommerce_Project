import React from 'react'
import { Link } from 'react-router-dom'
import { AiTwotoneMail } from "react-icons/ai";
import { MdAddCall,MdOutlineContactPhone } from "react-icons/md";



const Contact = () => {
  return (
    <div className='content'>
      <div className='contact_image'>
      <img   src="https://img.freepik.com/free-vector/call-center-design_24877-49643.jpg?t=st=1742447785~exp=1742451385~hmac=3993eb27c03ad4bf8949272b8f2d885c8c837b193517282bc5d76501188cbf78&w=826" 
          alt="Customer support illustration"  />

      </div>

      <div className="content-text">
        <h2 className='head2'>Contact Us</h2>
        <div className='emoji'>
          <p>Feel free to reach out to us for any information or queries.</p>
        <p><AiTwotoneMail/>Email:<Link to='email'>www.lucky@ecom_sales.com</Link></p>
        <p><MdAddCall/>Mobile:<Link to='contact'>9392738202</Link></p>
        <p><MdOutlineContactPhone />Toll free:<Link to='toll free'>1002 2003 3004</Link></p>
        </div>
        
      </div>
    </div>
  )
}

export default Contact
