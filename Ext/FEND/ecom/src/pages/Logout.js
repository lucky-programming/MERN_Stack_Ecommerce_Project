import React, { useContext, useEffect } from 'react'
import Context from '../componenets/Context'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Logout = () => {
    let obj=useContext(Context)
     
    let navigate=useNavigate()
    useEffect(()=>{
        obj.updateState({"token":"","firstname":"","lastname":"","mobile":"","address":"","role":""})
        localStorage.removeItem("userData");
        navigate("/login")
        toast.success("Successfully loged out.")
        
    },[])
    
    
  return (
    <div>
      Logout page
    </div>
  )
}

export default Logout
