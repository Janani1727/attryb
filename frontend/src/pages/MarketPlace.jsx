import React, { useEffect, useState } from "react";

import {
  Button,
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
import axios from "axios";

const MarketPlace = ({ user}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
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
    oemSpecs: "",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8082/MarketplaceInventory")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    const itemToEdit = data.find((item) => item._id === id);

    if (itemToEdit) {
      setEditItemId(id);
      setFormData({
        image: itemToEdit.image,
        title: itemToEdit.title,
        kmsOnOdometer: itemToEdit.kmsOnOdometer,
        accidentsReported: itemToEdit.accidentsReported,
        previousBuyers: itemToEdit.previousBuyers,
        registrationPlace: itemToEdit.registrationPlace,
        description: itemToEdit.description,
        currentPrice: itemToEdit.currentPrice,
        majorScratches: itemToEdit.majorScratches,
        originalPaint: itemToEdit.originalPaint,
        oemSpecs: itemToEdit.oemSpecs,
      });
      onOpen();
    }
  };

  const handleCloseModal = () => {
    setEditItemId(null);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;

    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const handleUpdate = () => {
    // Create an updated data object with the edited values
    const updatedData = {
      ...formData,
    };

    axios
      .patch(
        `http://localhost:8082/MarketplaceInventory/update/${editItemId}`,
        updatedData
      )
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        // Refresh data from the server
        fetchData();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        // Handle errors here
      });
  };

  const handleDelete = (id) => {
    axios
      .patch(
        `http://localhost:8082/MarketplaceInventory/update/${id}`
      )
      .then((response) => {
        console.log("Data deleted successfully");
        // Refresh data from the server
        fetchData();
      })
      .catch((error) => {
        console.error("Error deleted data:", error);
        // Handle errors here
      });
  };

  return (
    <>
  <Navbar user={user} />
      {data.map((el) => (
        <div key={el._id}>
          <div
            style={{
              border: "1px solid black",
              width: "80%",
              height: "300px",
              margin: "auto",
              display: "flex",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                border: "1px solid black",
                width: "40%",
                height: "300px",
              }}
            >
              <img src={el.image} alt="" />
            </div>

            <div
              style={{
                border: "1px solid black",
                width: "30%",
                height: "300px",
                textAlign: "left",
                padding: "20px",
              }}
            >
              <p>Title:{el.title}</p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                kms on odometer: {el.kmsOnOdometer}
              </p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                MajorScratches : {el.majorScratches}
              </p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                OriginalPaint : {el.originalPaint}
              </p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                PreviousBuyers : {el.accidentsReported}
              </p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                RegistrationPlace :{el.registrationPlace}{" "}
              </p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                CurrentPrice :{el.currentPrice}{" "}
              </p>
              <Button
                style={{
                  marginTop: "10px",
                  backgroundColor: "rgb(73, 73, 242)",
                  color: "white",
                }}
                onClick={() => {
                  handleEdit(el._id);
                  onOpen();
                }}
              >
                Edit
              </Button>

              <Button
                style={{
                  marginTop: "10px",
                  backgroundColor: "rgb(234, 35, 35)",
                  color: "white",
                }}
                marginLeft={"20px"}
                onClick={() => handleDelete(el._id)}
              >
                Delete
              </Button>
            </div>
            <div
              style={{
                border: "1px solid black",
                width: "30%",
                height: "300px",
                textAlign: "left",
                padding: "20px",
              }}
            >
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                Description
              </p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                Mileage: {el.oemSpecs.mileage}
              </p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                Power: {el.oemSpecs.power}
              </p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                Power :{el.oemSpecs.power}
              </p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                Max speed :{el.oemSpecs.maxSpeed}
              </p>
              <p
                style={{
                  marginTop: "8px",
                }}
              >
                List price: {el.oemSpecs.listPrice}{" "}
              </p>
            </div>
          </div>
          {/* <Button onClick={() => handleEdit(el._id)}>Edit</Button> */}
        </div>
      ))}

      {/* Modal for editing */}
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Car Data</ModalHeader>
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
              type="xt"
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
              // onClick={() => {
              // Add your update logic here
              // console.log("Updating data:", formData);
              onClick={handleUpdate}
              // }}
            >
              Update Data
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MarketPlace;
