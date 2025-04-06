// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const Spinner = () => {
//   const [count, setCount] = useState(5);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCount((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           navigate('/login', { state: { from: location.pathname } });
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [navigate, location]);

//   return (
//     <div className="text-center">
//       <div className="spinner-border" role="status">
//         <h1>Redirecting you in {count} seconds...</h1>
//         <span className="visually-hidden">Loading...</span>
//       </div>
//     </div>
//   );
// };

// export default Spinner;
