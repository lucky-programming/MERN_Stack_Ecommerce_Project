
import axios from 'axios'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {

    let [data,setReg]=useState({"email":"","password":"","securityAnswer": ""})
   let [msg,setMsg]=useState("")

   let [isVerified,setIsVerified]=useState(false)
   let navigate=useNavigate()
   

   let fun=(e)=>{
    setReg({...data,[e.target.name]:e.target.value})
  }

  let verifySecurityAnswer=async()=>{
    try{
      let res=!data.email||!data.securityAnswer
      if(res){
        setMsg("Invalid Email or security Answer.")
        toast.error("Please enter correct email or security answer.")
      }else{
        let res=await axios.post("http://localhost:5000/verify-security-question",{"email":data.email,"securityAnswer":data.securityAnswer})
        if(res.data.msg==="Security answer verified. You can reset your password."){
          toast.success("Security answer verified! Now enter a new password.")
          setIsVerified(true)
        }else{
          setMsg(res.data.msg)
          toast.error(res.data.msg)
        }
      }

      
    }catch(err){
      if (err.response) {
        setMsg(err.response.data.msg);
        toast.error(err.response.data.msg);
      } else {
        setMsg("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }

    }

  }
   //resetting the password 
  let reset=async()=>{
    if(!isVerified){
      setMsg("Please verify your security answer first.");
       toast.error("Please verify your security answer first.");
       return;
    }

    if(!data.email){

        setMsg("Invalid Email.Please check the Email.")
        toast.error("Invalid Email.Please check the Email.")
        return
    }
    if(!data.securityAnswer){
      setMsg("Security Answer cannot be empty.")
      toast.error("Security Answer cannot be empty.")
      return
    }
    if(data.password.length<8){
        setMsg("Password must be at least 8 charactors")
        return
    }
    try{
        let res=await axios.post("http://localhost:5000/forgotPassword",data)

        console.log(res.data.msg)
        setMsg(res.data.msg)
        toast.success("Hurrey! You successfully reset the password. Use the new password to login.")
        navigate("/login")
    }catch(err){
        console.log({"Error":err})
        setMsg("Error in resetting the Password.")
        toast.error("Something went wrong. Please try again.")
    }
    
  }

  return (
    <div className='register'>
           <div className='form'>
           <h1>Reset Password</h1>
           <div className='msg'>{msg}</div>
     
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email Address</label>
               <input type="email"  placeholder="Enter Your Email Address " className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={data.email} onChange={fun} required/>
                 <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
              
            <input  type="text" placeholder='Enter Your Security Answer' className="form-control" name='securityAnswer' value={data.securityAnswer} onChange={fun} required disabled={isVerified}/>
            </div>
            

     
    {!isVerified ? (
          <button onClick={verifySecurityAnswer} className="btn btn-primary">Verify Answer</button>
        ) : (
          <>
          <div className='mb-3'>
            <label htmlFor='exampleInputNPW' className='form-label'>Enter New Password</label>
          <input type="password" id='exampleInputNPW' placeholder='Enter New Password' className="form-control" name='password' value={data.password}  onChange={fun} required  />
          </div>
            <button onClick={reset} className="btn btn-primary">Reset The Password</button>
          </>
        )}
           </div>
         </div>
  )
}

export default ResetPassword
