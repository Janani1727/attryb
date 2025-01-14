

import React, { useState } from "react";
import axios from "axios";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';

export default function Authentication({ setIsAuthenticated }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState(null); // State to track logged-in user

  const toggleMode = () => {
    setIsSignup(!isSignup);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (isSignup) {
        const response = await axios.post("http://localhost:8082/register", formData);
        console.log(response.data); // Inspect response
        alert("Registration successful! Please log in.");
        setIsSignup(false);
        setIsAuthenticated(true); 
      } else {
        const response = await axios.post("http://localhost:8082/login", formData);
        console.log(response.data); // Inspect response
        const username = response.data.name; // Assuming the server sends the user's name
        setUser(username); // Save user data to state
        setIsAuthenticated(true);
        navigate("/oem");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  
    setFormData({ name: "", email: "", password: "" });
  };

  const handleLogout = () => {
    setUser(null); // Clear the user state
    setIsAuthenticated(false); // Update the authentication state
    navigate("/"); // Navigate to the homepage
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} /> {/* Show Navbar if user is logged in */}

      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Heading>{isSignup ? "Sign Up" : "Sign In"}</Heading>
          <Box
            width={"400px"}
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <form onSubmit={handleSubmit}>
              {isSignup && (
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </FormControl>
              )}
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </FormControl>
              <Stack spacing={4}>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  cursor={"pointer"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  {isSignup ? "Sign Up" : "Sign In"}
                </Button>
                <Text
                  cursor={"pointer"}
                  color={"blue.400"}
                  onClick={toggleMode}
                >
                  {isSignup
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </Text>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
