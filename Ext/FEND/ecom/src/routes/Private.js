// import { useEffect, useState, useContext } from "react";
// import { Outlet, Navigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import Spinner from "../pages/user/Spinner";
// import Context from "../componenets/Context";

// const Private = () => {
//   const [ok, setOk] = useState(null); // Null means checking status
//   const obj = useContext(Context);
//   const location = useLocation();

//   useEffect(() => {
//     const authCheck = async () => {
//       try {
//         const res = await axios.get("/private-auth", {
//           headers: { Authorization: `Bearer ${obj?.state?.token}` },
//         });
//         setOk(res.data.ok);
//       } catch (error) {
//         setOk(false);
//       }
//     };

//     if (obj?.state?.token) authCheck();
//     else setOk(false);
//   }, [obj.state.token]);

//   if (ok === null) return <Spinner />; // Show spinner while checking

//   return ok ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} replace />;
// };

// export default Private;
