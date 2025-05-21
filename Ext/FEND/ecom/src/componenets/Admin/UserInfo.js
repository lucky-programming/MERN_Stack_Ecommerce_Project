import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Context from "../Context";

const UserInfo = () => {
  const obj = useContext(Context);
  const [users, setUsers] = useState([]); // Assume API returns an array

  useEffect(() => {
      console.log("fetching users...")
      axios.get("http://localhost:5000/getUser").then((res) => {
        console.log(res.data)
          setUsers(res.data); // Store API response (expected to be an array)
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
        });
    
  }, [obj.state.role]); // Dependency added to avoid unnecessary re-renders

  return (
    <div className="container mt-4">
      <div className="row">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className="col-md-4">
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src="https://via.placeholder.com/150"
                  className="card-img-top"
                  alt="Profile"
                />
                <div className="card-body">

                  <ul className="list-group list-group-flush">

                    <li className="list-group-item">
                      <strong>First Name:</strong> {user.firstname}
                    </li>

                    <li className="list-group-item">
                      <strong>Last Name:</strong> {user.lastname}
                    </li>

                    <li className="list-group-item">
                      <strong>Email:</strong> {user.email}
                    </li>

                    <li className="list-group-item">
                      <strong>Address:</strong> {user.address}
                    </li>

                    <li className="list-group-item">
                      <strong>Contact Number:</strong> {user.mobile}
                    </li>

                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
