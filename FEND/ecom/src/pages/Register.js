import React, { useState } from 'react'
import axios from "axios"
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom'


const Register = () => {
  let [data,setReg]=useState({"email":"","firstname":"","lastname":"","password":"","mobile":"","address":"","securityQuestion":"What is Your fevorite colur?","securityAnswer":""})
  let [msg,setMsg]=useState("")
  let navigate=useNavigate()
  

  let fun=(e)=>{
    setReg({...data,[e.target.name]:e.target.value})
  }

 let reg=()=>{
  if(data.email!==""&&data.firstname!==""&&data.lastname!==""&&data.password!==""&&data.address!==""&&data.mobile!==""&&data.securityAnswer !== ""){
    axios.post("http://localhost:5000/addUser",data).then((res)=>{
      setMsg(res.data.msg)
      
      if(res.data.msg==="Account Created Successfully."){
        toast.success("Registration successful!")
        navigate("/login")
      }else{
        toast.error(res.data.msg)
      }

    }).catch((err)=>{
      setMsg("Error in Creating Account.Please Try Again")
      console.error(err)
      toast.error('Something went wrong. Please try again.');

    })
    

  }
  else{
    setMsg("Please fill The All the required fields.")

  }
 }
  return (
    <div className='register'>
      
      <div className='form'>
      <h1>Register</h1>
      <div className='msg'>{msg}</div>

      <div className="mb-3">
         <label htmlFor="exampleInputFirstName" className="form-label">First Name</label>
          <input type="text" placeholder='Enter First Name' className="form-control"  id="exampleInputFirstName" name='firstname' value={data.firstname} onChange={fun} required/>
       </div>

       <div className="mb-3">
         <label htmlFor="exampleInpuLastName" className="form-label">Last Name</label>
          <input type="text" placeholder='Enter Last Name' className="form-control" id="exampleInputLastName" name='lastname' value={data.lastname} onChange={fun} required/>
       </div>

       <div className="mb-3">
         <label htmlFor="exampleInputAddress" className="form-label">Address</label>
          <input type="text" placeholder='Enter Address' className="form-control" id="exampleInputAddress" name='address' value={data.address} onChange={fun} required/>
       </div>

       <div className="mb-3">
         <label htmlFor="exampleInputMobile" className="form-label">Contact Number</label>
          <input type="text" placeholder='Enter Contact Number' className="form-control" id="exampleInputMobile" name='mobile' value={data.mobile} onChange={fun} required/>
       </div>

       <div className="mb-3">
         <label htmlFor="exampleInputEmail1" className="form-label">Email Adress</label>
          <input type="email" placeholder='Enter Your Email Address' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={data.email} onChange={fun} required/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
       </div>

       <div className="mb-3">
         <label htmlFor="exampleInputPassword" className="form-label">Password</label>
          <input type="password" placeholder='Create A Password' className="form-control" id="exampleInputPassword" name='password' value={data.password} onChange={fun} required/>
       </div>

       {/* Security Question */}
       <div className="mb-3">
          <label htmlFor="securityQuestion" className="form-label">
            Security Question
          </label>
          <select className="form-control" id="securityQuestion" name="securityQuestion" value={data.securityQuestion} onChange={fun}>
            <option value="What is your favorite sports name?">What is your favorite sports name?</option>
            <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
            <option value="What was the name of your first school?">What was the name of your first school?</option>
          </select>
        </div>
       
       <div className="mb-3">
         <label htmlFor="exampleInputPasswordSecurityAnswer" className="form-label">Secuity Code</label>
          <input type="text" placeholder='Enter Your Fevorite colour Name' className="form-control" id="exampleInputPasswordSecurityAnswer" name='securityAnswer' value={data.securityAnswer} onChange={fun} required/>
       </div>

       <button onClick={reg} className="btn btn-primary">Submit</button>
      </div>
    </div>
  )
}

export default Register
