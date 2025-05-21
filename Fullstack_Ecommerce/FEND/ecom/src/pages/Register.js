// Register.jsx
import React, { useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [data, setReg] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    mobile: "",
    address: "",
    securityQuestion: "What is your favorite sports name?",
    securityAnswer: ""
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setReg({ ...data, [e.target.name]: e.target.value });
  };

  const register = () => {
    if (data.email && data.firstname && data.lastname && data.password && data.address && data.mobile && data.securityAnswer) {
      axios.post("http://localhost:5000/addUser", data)
        .then((res) => {
          setMsg(res.data.msg);
          if (res.data.msg === "Account Created Successfully.") {
            toast.success("Registration successful!");
            navigate("/login");
          } else {
            toast.error(res.data.msg);
            
          }
        })
        .catch((err) => {
          setMsg("Error in Creating Account. Please Try Again");
          console.error(err);
          toast.error('Something went wrong. Please try again.');
        });
    } else {
      setMsg("Please fill in all the required fields.");
      toast.error("Please Fill All the Required Fields!")
    }
  };

  return (
    <div className='register'>
      <div className='form fadeInUp' role="form" aria-labelledby="registerHeading">
        <h1 id="registerHeading">Create an Account</h1>
        <div className='msg'>{msg}</div>

        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input type="text" placeholder='Enter First Name' className="form-control" id="firstName" name='firstname' value={data.firstname} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input type="text" placeholder='Enter Last Name' className="form-control" id="lastName" name='lastname' value={data.lastname} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" placeholder='Enter Address' className="form-control" id="address" name='address' value={data.address} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">Contact Number</label>
          <input type="text" placeholder='Enter Contact Number' className="form-control" id="mobile" name='mobile' value={data.mobile} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input type="email" placeholder='Enter Your Email Address' className="form-control" id="email" name='email' value={data.email} onChange={handleChange} required />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" placeholder='Create A Password' className="form-control" id="password" name='password' value={data.password} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="securityQuestion" className="form-label">Security Question</label>
          <select className="form-control" id="securityQuestion" name="securityQuestion" value={data.securityQuestion} onChange={handleChange}>
            <option value="What is your favorite sports name?">What is your favorite sports name?</option>
            <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
            <option value="What was the name of your first school?">What was the name of your first school?</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="securityAnswer" className="form-label">Security Answer</label>
          <input type="text" placeholder='Enter Your Answer' className="form-control" id="securityAnswer" name='securityAnswer' value={data.securityAnswer} onChange={handleChange} required />
        </div>

        <button onClick={register} className="btn btn-primary">Submit</button>
      </div>
    </div>
  );
};

export default Register;
