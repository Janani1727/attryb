
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
  useToast,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import axios from "axios";

const MarketPlace = () => {
  
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

  const toast = useToast(); // Creating the toast instance for snackbar

  const fetchData = () => {
    axios
      .get("https://attryb-7m01.onrender.com/MarketplaceInventory")
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
    if (!user) {
      toast({
        title: "Please login to update data.",
        description: "You need to be logged in to update or delete data.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

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
  
  let user=localStorage.getItem("user");
  console.log("user",user)

  const handleUpdate = () => {
    if (!user) {
      toast({
        title: "Please login to update data.",
        description: "You need to be logged in to update data.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const updatedData = { ...formData };

    axios
      .patch(
        `https://attryb-7m01.onrender.com/MarketplaceInventory/update/${editItemId}`,
        updatedData
      )
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        fetchData();
        handleCloseModal();
        toast({
          title: "Data updated successfully.",
          description: "The car data has been updated.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        toast({
          title: "Error updating data.",
          description: "There was an error while updating the data.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  const handleDelete = (id) => {
    if (!user) {
      toast({
        title: "Please login to delete data.",
        description: "You need to be logged in to delete data.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    fetch(`https://attryb-7m01.onrender.com/MarketplaceInventory/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Data deleted successfully");
          fetchData();
          toast({
            title: "Data deleted successfully.",
            description: "The car data has been deleted.",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } else {
          console.error("Failed to delete the data");
          toast({
            title: "Error deleting data.",
            description: "There was an error while deleting the data.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        toast({
          title: "Error deleting data.",
          description: "There was an error while deleting the data.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Navbar  />
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
              <p>Title: {el.title}</p>
              <p style={{ marginTop: "8px" }}>
                kms on odometer: {el.kmsOnOdometer}
              </p>
              <p style={{ marginTop: "8px" }}>
                Major Scratches: {el.majorScratches ? "Yes" : "No"}
              </p>
              <p style={{ marginTop: "8px" }}>
                Original Paint: {el.originalPaint ? "Yes" : "No"}
              </p>
              <p style={{ marginTop: "8px" }}>
                Accidents Reported: {el.accidentsReported}
              </p>
              <p style={{ marginTop: "8px" }}>
                Registration Place: {el.registrationPlace}
              </p>
              <p style={{ marginTop: "8px" }}>
                Current Price: {el.currentPrice}
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
              <p style={{ marginTop: "8px" }}>
                Description:{" "}
                {el.description && Array.isArray(el.description)
                  ? el.description[0]
                  : "No description available"}
              </p>
              <p style={{ marginTop: "8px" }}>Mileage: {el.oemSpecs.mileage}</p>
              <p style={{ marginTop: "8px" }}>Power: {el.oemSpecs.power}</p>
              <p style={{ marginTop: "8px" }}>
                Max Speed: {el.oemSpecs.maxSpeed}
              </p>
              <p style={{ marginTop: "8px" }}>
                List Price: {el.oemSpecs.listPrice}
              </p>
            </div>
          </div>
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
              type="number"
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
            <Input
              border={"1px solid black"}
              marginTop={"10px"}
              placeholder="Major Scratch"
              type="text"
              name="majorScratches"
              value={formData.majorScratches}
              onChange={handleChange}
            />
            <Input
              border={"1px solid black"}
              marginTop={"10px"}
              placeholder="Original Paint"
              type="text"
              name="originalPaint"
              value={formData.originalPaint}
              onChange={handleChange}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Update Data
            </Button>
            <Button variant="ghost" onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MarketPlace;
