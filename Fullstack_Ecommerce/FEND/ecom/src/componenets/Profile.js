import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Context from "./Context";

const Profile = () => {
  let obj = useContext(Context);
  let [user, setUser] = useState({});
  let [profile, setProfile] = useState({ profileImage: "" });
  let [msg, setMsg] = useState("");

  let profileImage = (e) => {
    setProfile({ ...profile, profileImage: e.target.files[0] });
  };

  let setImg = () => {
    if (!profile.profileImage) {
      toast.error("Please Select the Profile Image.");
      return;
    }

    let fd = new FormData();
    fd.append("profileImage", profile.profileImage);
    fd.append("email", obj.state.email);

    axios
      .post("http://localhost:5000/uploadProfileImage", fd, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((res) => {
        toast.success("Profile Image successfully updated");
        setUser({ ...user, profileImage: res.data.profileImage }); // Updating local state
        obj.setState({ ...obj.state, profileImage: res.data.profileImage }); // Updating global state
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error uploading image");
      });
  };

  useEffect(() => {
    if (!obj.state || !obj.state.email) {
      console.log("Email not found in context object", obj.state);
      return;
    }

    axios
      .get(`http://localhost:5000/getSingleUser/${obj.state.email}`)
      .then((res) => {
        console.log(res.data);
        toast.success("Check Your Profile or credentials!");
        setUser(res.data);
        setMsg(res.data.msg);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        toast.error("Failed to fetch user details.");
        setMsg("Failed to fetch user details");
      });
  }, [obj.state]);

  return (
    <div className="profile-container container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 profile-card">
          <div className="row align-items-center">
            {/* Left Side: Profile Image & Buttons */}
            <div className="col-md-4 text-center profile-sidebar">
              <div>{msg}</div>
              <div className="profile-image-wrapper">
                <img
                  src={
                    user.profileImage ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                  }
                  className="profile-image"
                  alt="Profile"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={profileImage}
                className="form-control-file mt-3"
              />
              <button className="btn btn-success mt-2" onClick={setImg}>
                Upload Image
              </button>
              <button className="btn btn-primary mt-3 w-100">Edit Profile</button>
            </div>

            {/* Right Side: Profile Details */}
            <div className="col-md-8 profile-content">
              <h2 className="text-primary text-center">Your Profile</h2>
              <hr />
              <div className="profile-details">
                <p>
                  <strong>First Name:</strong> {user.firstname || "N/A"}
                </p>
                <p>
                  <strong>Last Name:</strong> {user.lastname || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {user.address || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {user.email || "N/A"}
                </p>
                <p>
                  <strong>Mobile:</strong> {user.mobile || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
