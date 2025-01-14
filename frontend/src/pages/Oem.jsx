
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
import Navbar from '../components/Navbar';
const Oem = () => {
  const [oem, setOem] = useState([]); // Initialize as null
  const [mileage, setMileage] = useState([]);
  const [price, setPrice] = useState([]);
  const [filterColor, setFilterColor] = useState('');
  const [searchQuery, setSearchQuery] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchResults, setSearchResults] = useState([]);

  const [formData, setFormData] = useState({
    image: "",
    title: "",
    kmsOnOdometer: 0, 
    accidentsReported: 0, 
    previousBuyers: 0, 
    registrationPlace: "",
    description: "",
    currentPrice: 0, 
    majorScratches: false,
    originalPaint: true,
    oemSpecs: ""
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Convert value to number if the input type is "number"
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const fetchData = () => {
    axios
      .get(`http://localhost:8082/OEM`)
      .then((res) => setOem(res.data)) // Update oem state with the fetched data
      .catch((err) => console.log(err));
  }


  useEffect(() => {
    fetchData();
  }, [mileage, price, filterColor, searchQuery]);

  const PostData = (oemId) => {
    axios
      .post("http://localhost:8082/MarketplaceInventory/create", {
        ...formData,
        oemSpecs: oemId, // Set oemId from the argument
      })
      .then((res) => {
        console.log("Data posted successfully:", res.data);
        setOem(res.data);
      })
      .catch((err) => {
        console.error("Error posting data:", err);
      });
  };

  async function sortByMileage(value) {
    let mile = await axios.get(`http://localhost:8082/OEM?sortBy=mileage&sortOrder=${value}`)
    setMileage(mile)
  }

  async function sortByPrice(value) {
    let pri = await axios.get(`http://localhost:8082/OEM?sortBy=listPrice&sortOrder=${value}`)
    setOem(pri.data)
  }

  async function FilterByColor(color) {
    try {
      let filteredData = await axios.get(`http://localhost:8082/OEM?filterColor=${color}`);
      setOem(filteredData.data);
    } catch (error) {
      console.error(error);
    }
  }



  return (
    <>
      <Navbar  />
      <div>

        <div> 
          <div>
          <div style={{ display: 'flex' , marginTop:"20px",marginBottom:"30px" }}>
          <div >
            <select style={{border:"1px solid black", marginLeft:"60px",width:"200px",height:"40px"}} onChange={(e) => sortByMileage(e.target.value)}>
              <option value="">Sort by Mileage</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
          <div>
            <select style={{border:"1px solid black", marginLeft:"60px",width:"200px",height:"40px"}} onChange={(e) => sortByPrice(e.target.value)}>
              <option value="">Sort By Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
          <div >
            <select style={{border:"1px solid black", marginLeft:"60px",width:"200px",height:"40px"}} onChange={(e) => FilterByColor(e.target.value)}>
              <option value="">Filter by color</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="blue">Blue</option>
              <option value="red">Red</option>
            </select>
          </div>



          <input style={{border:"1px solid black",marginLeft:"20px",width:"700px",height:"40px"}} placeholder="search by model name"/>
        </div>
          </div>
        
        </div>
       

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            width: "100%",
            padding:"20px"
          }}
        >

          {oem === null ? ( 
            <div>Loading...</div>
          ) : (
            oem.map((el, index) => (

             <>

              <div
                onClick={onOpen}
                key={index}
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
              <ModalHeader>Add Your Car with OEM Specifications</ModalHeader>
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
                  type="number"
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
                <Input
                  border={"1px solid black"}
                  marginTop={"10px"}
                  placeholder="Major Scratch"
                  type="text"
                  name=" majorScratches"
                  value={formData.majorScratches}
                  onChange={handleChange}
                />
                <Input
                  border={"1px solid black"}
                  marginTop={"10px"}
                  placeholder="Original paint"
                  type="text"
                  name="originalPaint"
                  value={formData.originalPaint}
                  onChange={handleChange}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                   onClick={() => PostData(el._id, formData)}
                  
                >
                  Add Data
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
              </>
            ))
          )}

          
        </div>
      </div>
    </>
  );
};

export default Oem;