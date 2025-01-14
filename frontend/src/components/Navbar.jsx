

import React from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  console.log(user,"lkjfdg"); // Debug user state
  return (
    <Box>
      <Flex justifyContent={"space-evenly"} bg={"pink"} padding={6} fontSize={20} fontWeight={"bold"}>
        <Link to="/">
          <Text fontFamily={"cursive"} color={"rgb(32, 39, 167)"} fontWeight={"bold"}>
            AttrybCar
          </Text>
        </Link>
        <Link to="/">Market Place</Link>
        <Link to="/oem">Add Inventory</Link>
        {user ? (
          <Flex alignItems="center">
            <p>{user}</p> {/* Display the user's name */}
            <Button onClick={onLogout} colorScheme="red">
              Logout
            </Button>
          </Flex>
        ) : (
          <Link to="/auth">Account</Link>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
