

import { Button, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Oem = () => {
  const navigate = useNavigate();
  const [oem, setOem] = useState([]); // Initialize as an empty array
  const [mileage, setMileage] = useState([]);
  const [price, setPrice] = useState([]);
  const [filterColor, setFilterColor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchResults, setSearchResults] = useState([]);

  const [formData, setFormData] = useState({
    image: "",
    title: "",
    kmsOnOdometer: "",
    accidentsReported: "",
    previousBuyers: "",
    registrationPlace: "",
    description: "",
    currentPrice: "",
    majorScratches: false,
    originalPaint: true,
    oemSpecs: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Convert value to number if the input type is "number"
    const parsedValue = type === "number" ? parseFloat(value) : value;
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const fetchData = () => {
    axios
      .get(`https://attryb-7m01.onrender.com/OEM`)
      .then((res) => setOem(res.data)) // Update oem state with the fetched data
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, [mileage, price, filterColor, searchQuery]);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(oem); // If no search query, show all OEM data
    } else {
      const filteredResults = oem.filter((car) =>
        car.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
  }, [searchQuery, oem]);

  const PostData = (oemId) => {
    axios
      .post("https://attryb-7m01.onrender.com/MarketplaceInventory/create", {
        ...formData,
        oemSpecs: oemId, // Set oemId from the argument
      })
      .then((res) => {
        console.log("Data posted successfully:", res.data);
        setOem(res.data);
        navigate("/market");
      })
      .catch((err) => {
        console.error("Error posting data:", err);
      });
  };

  async function sortByMileage(value) {
    let mile = await axios.get(
      `https://attryb-7m01.onrender.com/OEM?sortBy=mileage&sortOrder=${value}`
    );
    setMileage(mile);
  }

  async function sortByPrice(value) {
    let pri = await axios.get(
      `https://attryb-7m01.onrender.com/OEM?sortBy=listPrice&sortOrder=${value}`
    );
    setOem(pri.data);
  }

  async function FilterByColor(color) {
    try {
      let filteredData = await axios.get(
        `https://attryb-7m01.onrender.com/OEM?filterColor=${color}`
      );
      setOem(filteredData.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Navbar />
      <div>
        <div>
          <div style={{ display: "flex", marginTop: "20px", marginBottom: "30px" }}>
            <div>
              <select
                style={{
                  border: "1px solid black",
                  marginLeft: "60px",
                  width: "200px",
                  height: "40px",
                }}
                onChange={(e) => sortByMileage(e.target.value)}
              >
                <option value="">Sort by Mileage</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
            <div>
              <select
                style={{
                  border: "1px solid black",
                  marginLeft: "60px",
                  width: "200px",
                  height: "40px",
                }}
                onChange={(e) => sortByPrice(e.target.value)}
              >
                <option value="">Sort By Price</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
            <div>
              <select
                style={{
                  border: "1px solid black",
                  marginLeft: "60px",
                  width: "200px",
                  height: "40px",
                }}
                onChange={(e) => FilterByColor(e.target.value)}
              >
                <option value="">Filter by color</option>
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
              </select>
            </div>

            <input
              style={{
                border: "1px solid black",
                marginLeft: "20px",
                width: "700px",
                height: "40px",
              }}
              placeholder="search by model name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            width: "100%",
            padding: "20px",
          }}
        >
          {Array.isArray(searchResults) && searchResults.length > 0 ? (
            searchResults.map((el, index) => (
              <>
                <div
                  key={index}
                  onClick={onOpen}
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  <Text>{el.model}</Text>
                  <Text>year: {el.year}</Text>
                  <Text>list price :{el.listPrice}</Text>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {el.availableColors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: color,
                          marginRight: "5px",
                        }}
                      ></div>
                    ))}
                  </div>
                  <Text> Max Speed :{el.maxSpeed}</Text>
                  <Text>Mileage : {el.mileage}</Text>
                  <Text>Power: {el.power}</Text>
                </div>

                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>
                      Add Your Car with OEM Specifications
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Input
                        border={"1px solid black"}
                        placeholder="Image URL"
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                      />
                      <Input
                        border={"1px solid black"}
                        marginTop={"10px"}
                        placeholder="Title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      <Input
                        border={"1px solid black"}
                        marginTop={"10px"}
                        placeholder="Kms on Odometer"
                        type="number"
                        name="kmsOnOdometer"
                        value={formData.kmsOnOdometer}
                        onChange={handleChange}
                      />
                      <Input
                        border={"1px solid black"}
                        marginTop={"10px"}
                        placeholder="Accidents Reported"
                        type="text"
                        name="accidentsReported"
                        value={formData.accidentsReported}
                        onChange={handleChange}
                      />
                      <Input
                        border={"1px solid black"}
                        marginTop={"10px"}
                        placeholder="Previous Buyers"
                        type="number"
                        name="previousBuyers"
                        value={formData.previousBuyers}
                        onChange={handleChange}
                      />
                      <Input
                        border={"1px solid black"}
                        marginTop={"10px"}
                        placeholder="Registration Place"
                        type="text"
                        name="registrationPlace"
                        value={formData.registrationPlace}
                        onChange={handleChange}
                      />
                      <Input
                        border={"1px solid black"}
                        marginTop={"10px"}
                        placeholder="Description"
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      <Input
                        border={"1px solid black"}
                        marginTop={"10px"}
                        placeholder="Current Price"
                        type="number"
                        name="currentPrice"
                        value={formData.currentPrice}
                        onChange={handleChange}
                      />
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme="blue" onClick={() => PostData(el._id)}>
                        Submit
                      </Button>
                      <Button variant="ghost" onClick={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            ))
          ) : (
            <div>No Cars Available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Oem;
