import { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Context from "../Context";
import axios from "axios";



const UserDashboard = () => {
  let [user,setUser]=useState({})
  let obj=useContext(Context)

  useEffect(()=>{
    axios.get(`http://localhost:5000/getSingleUser/${obj.state.email}`).then((res)=>{
        setUser(res.data)
    }).catch((err)=>{
        console.log("error in fetching details...",err)
    })
  },[obj.state.email])

  return (
    <div className="container-fluid adminDashboard">
      {/* Sidebar */}
      <div className="left-info">
        <h4>{user.firstname} {user.lastname}</h4>
        <ul className="list-group">
          <li className="list-group-item"><Link to="profile">Profile</Link></li>
          <li className="list-group-item"><Link to="orders">Orders</Link></li>
          <li className="list-group-item"><Link to="wishList">Wish List</Link></li>
          {/* <li className="list-group-item"><Link to="usersInfo">Users</Link></li> */}
        </ul>
      </div>
      {/* Dynamic Content */}
      <div className="right-info">
        <Outlet/>
      </div>
    </div>
  );
};

export default UserDashboard;
