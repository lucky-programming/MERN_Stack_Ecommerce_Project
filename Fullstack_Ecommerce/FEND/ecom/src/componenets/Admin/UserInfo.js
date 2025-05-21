import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const UserInfo = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getUser");
      setUsers(res.data);
      setFilteredUsers(res.data);
      if (res.data.length > 0) {
        toast.success("Hey Admin! Here are all users.");
      } else {
        toast.info("No users found.");
      }
    } catch (err) {
      console.error("Error fetching user details", err);
      toast.error("Error fetching the users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className="container mt-4 user-info-container">
      <h2 className="text-center mb-4 header-text">Users Information</h2>

      <div className="row mb-4 justify-content-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control search-box"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="row">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div key={index} className="col-sm-12 col-md-6 col-lg-4 mb-4">
                <div className="card user-card animate__animated animate__fadeInUp">
                <div className="card-body">
                  <h5 className="card-title user-name">
                    {user.firstname} {user.lastname}
                    </h5>
                    <ul className="list-unstyled user-details">
                      <li><strong>Email:</strong> {user.email}</li>
                      <li><strong>Mobile:</strong> {user.mobile}</li>
                      <li><strong>Address:</strong> {user.address}</li>
                      <li><strong>Role:</strong><span className={`role-badge ${user.role.toLowerCase()}`}> {user.role}</span></li>
                    </ul>
                </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-4 w-100">
              <p>No users match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
