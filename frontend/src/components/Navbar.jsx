

// import React from "react";
// import { Box, Flex, Text, Button } from "@chakra-ui/react";
// import { Link } from "react-router-dom";
// import { FaCar } from "react-icons/fa6";
// const Navbar = ({ user, onLogout }) => {

//   let name=localStorage.getItem("user");
 
//   const handleLogout = () => {
   
  
//     localStorage.removeItem("user"); 
   
//   };
//   return (
   
//     <Box>
//       <Flex justifyContent={"space-evenly"} bg={"pink"} padding={6} fontSize={20} fontWeight={"bold"}>
//         <Link to="/">
//         <Flex alignItems="center" gap={5}>
//            <FaCar size={40}/> 
//           <Text fontFamily={"cursive"}  fontWeight={"bold"}>
//           AttrybCar
//           </Text>
//           </Flex>
//         </Link>
//         <Link to="/">Market Place</Link>
//         <Link to="/oem">Add Inventory</Link>
//         {user ? (
//           <Flex alignItems="center">
//             <p>{user}</p> {/* Display the user's name */}
//             <Button onClick={handleLogout} colorScheme="red">
//               Logout
//             </Button>
//           </Flex>
//         ) : (
//           <Link to="/auth">Account</Link>
//         )}
//       </Flex>
//     </Box>
//   );
// };

// export default Navbar;

import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaCar } from "react-icons/fa6";

const Navbar = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // console.log(storedUser,"kuyhj")
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the user object
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Update the user state to null after logout
  };

  return (
    <Box>
      <Flex justifyContent={"space-evenly"} bg={"pink"} padding={6} fontSize={20} fontWeight={"bold"}>
        <Link to="/">
          <Flex alignItems="center" gap={5}>
            <FaCar size={40} />
            <Text fontFamily={"cursive"} fontWeight={"bold"}>
              AttrybCar
            </Text>
          </Flex>
        </Link>
        <Link to="/">Market Place</Link>
        <Link to="/oem">Add Inventory</Link>
        {user ? (
          <Flex alignItems="center">
            <Text>{user.name}</Text> {/* Display the user's name */}
            <Button onClick={handleLogout} colorScheme="red" ml={4}>
              Logout
            </Button>
          </Flex>
        ) : (
          <Link to="/auth">Login</Link> // Show "Login" if no user is logged in
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
