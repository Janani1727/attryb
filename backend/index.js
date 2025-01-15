const express = require("express")
require('dotenv').config()
const cors = require('cors')
const { connection } = require("./config/db")
const { MarketplaceInventoryRouter } = require("./route/inventory.route")
const { userRouter } = require("./route/user.route")
const { OEMRouter } = require("./route/oemspecs.route")
// const { auth } = require("./middleware/Auth.middleware")
const { MarketplaceInventoryModel } = require("./model/inventory.model")

const app=express()
app.use(cors())
app.use(express.json())


app.use(cors({
    origin: "https://attrybfrontend-ipxxyylhw-janani1727s-projects.vercel.app/", // Replace with your frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }));
  


MarketplaceInventoryRouter.get("/",async(req,res)=>{
    try{
        const oldCars = await MarketplaceInventoryModel.find().populate('oemSpecs')
        res.send(oldCars)
    }catch(err){
        console.log({"msg":"Error Occured","error":err})
    }
})
app.use("/",userRouter)
// app.use(auth)
app.use("/OEM",OEMRouter)
app.use("/MarketplaceInventory",MarketplaceInventoryRouter)

app.get("/",(req,res)=>{
    res.send("Home page")
})


app.listen(process.env.PORT,async()=>{
    try{
        await connection
        console.log("connected to DB")
    }catch(err){
        console.log('err:', err)
    }
    console.log(`server running at PORT ${process.env.port}`)
})


