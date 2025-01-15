
import React, { useState, useEffect } from "react";
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
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignup(!isSignup);
  };

  useEffect(() => {
    // Check if user is already authenticated
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      navigate("/oem");
    }
  }, [setIsAuthenticated, navigate]);

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let response;
      if (isSignup) {
        response = await axios.post("https://attryb-7m01.onrender.com/register", formData);
        alert("Registration successful! Please log in.");
        setIsSignup(false); // Switch to login mode after successful registration
      } else {
        response = await axios.post("https://attryb-7m01.onrender.com/login", formData);
  

        console.log(response.data);
  
      
        if (response.data.msg === "User Does Not Exist") {
          alert("User not found. Please register first.");
          return; // Stop the login process if the user doesn't exist
        } else if (response.data.msg === "Password Is Incorrect") {
          alert("Incorrect password. Please try again.");
          return;
        }
  
        const username = response.data.name; 
        localStorage.setItem("user", JSON.stringify(response.data)); 
        setUser(username); 
        setIsAuthenticated(true); 
        navigate("/oem"); 
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  
   
    setFormData({ name: "", email: "", password: "" });
  };
  

  

  return (
    <>

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
