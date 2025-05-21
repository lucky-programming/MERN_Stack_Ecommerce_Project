import React, { useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Context from '../componenets/Context'

const Login = () => {
 let [data,setReg]=useState({"email":"","password":""})
   let [msg,setMsg]=useState("")
   let navigate=useNavigate()
   let obj=useContext(Context)
   
 
   let fun=(e)=>{
     setReg({...data,[e.target.name]:e.target.value})
   }
 
  let login=()=>{
   if(data.email!==""&&data.password!==""){
     axios.post("http://localhost:5000/login",data).then((res)=>{
       setMsg(res.data.msg)

       if (res.data.token!==undefined) {
        const userData = {
          _id: res.data._id,
          token: res.data.token,
          firstname: res.data.firstname,
          lastname: res.data.lastname,
          email: res.data.email,
          role: res.data.role,
          mobile: res.data.mobile,
          address: res.data.address,
        };

        // Update Context
        obj.updateState(userData);

        // Store in Local Storage (Persistent Login)

        localStorage.setItem("userData", JSON.stringify(userData));
        setMsg("")
        toast.success("Congradulations! You Loged in.")
        navigate("/")

        // navigate(location.state?.from || "/dashboard", { replace: true });
       }

       else{


       }
     }).catch((err)=>{
       setMsg("Error in log into Your Account.Please Try Again")
       console.error(err)
       toast.error('Something went wrong. Please try again.');
 
     })
     
   }
   else{
     setMsg("Please fill The All the required fields.")
     toast.error("Please fill The All the required fields!")
 
   }
  }

  // let reset=()=>{
  //   if(!data.email){
  //     setMsg("Invalid Email Address")
  //   }else{
      
  //       navigate("/resetPassword")
       
  //     }
  // }

   return (
     <div className='register'>
       <div className='form'>
       <h1>Log in</h1>
       <div className='msg'>{msg}</div>
 
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email Adress</label>
           <input type="email" placeholder='Enter Email Address' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={data.email} onChange={fun} required/>
             <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
 
        <div className="mb-3">
          <label htmlFor="exampleInputPassword" className="form-label">Password</label>
           <input type="password" placeholder='Enter Password' className="form-control" id="exampleInputPassword" name='password' value={data.password} onChange={fun} required/>
        </div>

        <div className='for_create'>
           <p><Link to='/resetPassword'>Forgot Password</Link></p>
           <p><Link to='/reg'>Create New Account</Link></p>        
        
        </div>
        
        <button onClick={login} className="btn btn-primary">Login</button>
       </div>
     </div>
   )
}

export default Login
