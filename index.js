const express = require("express")
const fs = require("fs")
const path = require("path")


const app = express();
const PORT = 9000;
app.use(express.json())


// All Rooms Data

const rooms = [];

// Rooms Data

let Room1= {
    "Room_id" : "001",
    "Number_Of_Seats" : "240",
    "Amenities" : ["AC","LED screen","Projector","Stage"],
    "Price_for_1hr" : "Rs-1500/-"
}
let Room2= {
    "Room_id" : "002",
    "Number_Of_Seats" : "400",
    "Amenities" : ["AC","LED screen","Projector","Stage","Wi-fi","Mic","Speakers"],
    "Price_for_1hr" : "Rs-2200/-"
}
let Room3 = {
    "Room_id" : "101",
    "Number_Of_Seats" : "300",
    "Amenities" : ["AC","LED screen","Projector","Stage","Mic","Speakers"],
    "Price_for_1hr" : "Rs-2000/-"
}
let Room4 = {
    "Room_id" : "102",
    "Number_Of_Seats" : "300",
    "Amenities" : ["AC","LED screen","Projector","Stage","Wifi","Mic","Speakers"],
    "Price_for_1hr" : "Rs-2500/-"
}
let Room = {};
rooms.push(Room1)
rooms.push(Room2)
rooms.push(Room3)
rooms.push(Room4)

// Booked Rooms with Customer Name List

const Bookings = [];

//Booking a room with Customer name

let cus1 = {
    "Customer_Name" : "Ishwarya",
    "Date" : "02-03-2024",
    "Start_Time" : "10:30:00 hrs",
    "End_Time" : "13:30:00 hrs",
    "Booking_Id":"4514",
    "Booked_On":"24-02-2024",
    "Room_Id" : "102",
    "Status" : "Booked"
}
Bookings.push(cus1)
let cus2 = {
    "Customer_Name" : "Hari",
    "Date" : "14-03-2024",
    "Start_Time" : "11:00:00 hrs",
    "End_Time" : "15:30:00 hrs",
    "Booking_Id":"8716",
    "Booked_On":"15-01-2024",
    "Room_Id" : "001",
    "Status" : "Booked"
}
Bookings.push(cus2)
let cus3 ={
    "Customer_Name" : "Ishwarya",
    "Date" : "05-03-2024",
    "Start_Time" : "11:00:00 hrs",
    "End_Time" : "15:30:00 hrs",
    "Booking_Id":"5624",
    "Booked_On":"08-02-2024",
    "Room_Id" : "001",
    "Status" : "Booked"
}
Bookings.push(cus3)
let cust = {}

let Today = new Date();
const DateToday = Today.toISOString().slice(0,10)

// To get all rooms
app.get("/",(req,res)=>{
    try{
        res.status(200).send(rooms)
    }
    catch(err){
        res.status(400).send(err)
    }
})


// To create rooms
app.post("/CreateRoom",(req,res)=>{

    fs.writeFile(path.join(__dirname,"roomData.txt"),JSON.stringify(rooms),(err)=>{
        if(err){
            res.status(400).send(err)
        }else{
            if(req.body.Room_id){
                let CreateRooms =rooms.find(door=>door.Room_id==req.body.Room_id)
                if(CreateRooms!= undefined){
                    res.status(400).send("Room already exists")
                }else{
                    let room_id = req.body.Room_id
                    let seats ="";
                    let facility ="";
                    let rate = "";
                    let vacancy="";
                    if(req.body.Number_Of_Seats){
                         seats = req.body.Number_Of_Seats
                    }else{seats = "200"}
                    if(req.body.Amenities){
                        facility = req.body.Amenities
                    }else{
                        facility = ["Ac","Speaker","Mic","LCD screen","Projector"]
                    }
                    if(req.body.Price_for_1hr){
                        rate = req.body.Price_for_1hr
                    }else{
                        rate = "Rs-1000/-"
                    }
                    if(req.body.Status){
                        vacancy = req.body.Status
                    }else{vacancy = "Available"}

                    Room = {"Room_id" : room_id,"Number_Of_Seats" :seats,"Amenities" : facility,"Price_for_1hr" : rate,"Status" : vacancy}
                    rooms.push(Room)
                    res.status(200).send(rooms)
                }
            }
            else{
                res.status(400).send("Try to create a room using Room_id,Number_Of_Seats,Amenities,Price_for_1hr,Status")
            }
        }
    })
})


// Booking a Room

app.post("/RoomBooking",(req,res)=>{
    fs.writeFile(path.join(__dirname,"BookingData.txt"),JSON.stringify(Bookings),(err)=>{
        if(err){
            res.status(400).send(err)
        }else{
            if(req.body.Customer_Name && (req.body.Date && req.body.Room_Id)){
                let RoomSearch = rooms.findIndex(data=>data.Room_id==req.body.Room_Id)
                if(RoomSearch== "-1"){
                    res.status(400).send("The room you are searching for does not exists")
                }
                else{
                    let OnTime="";
                    let OffTime="";
                    if(req.body.Start_Time){
                       OnTime = req.body.Start_Time
                    }else{OnTime = "09:00:00 hrs"}
                    if(req.body.End_Time){
                        OffTime = req.body.End_Time
                    }else{OffTime = "14:00:00 hrs"}
                    const num = Math.random()*10000
                    const Book_Id = Math.ceil(num)
                    cust = {"Customer_Name":req.body.Customer_Name,"Date":req.body.Date,"Start_Time":OnTime,"End_Time":OffTime,"Room_Id":req.body.Room_Id,"Status":"Booked","Booked_On":DateToday,"Booking_Id":Book_Id}
                    let out =""
                    for(let i of Bookings){
                        if(i.Room_Id==req.body.Room_Id && i.Date==req.body.Date){
                            out = "true"
                            break;
                        }
                        else{
                           out = "false"
                        }
                    }
                    if(out=="true"){
                        res.status(400).send("This room is already booked for this date")
                    }
                    else{
                        Bookings.push(cust)
                        res.status(200).send(cust)
                    }
                }
            }
            else{
                res.status(400).send("Kindly try to book a room with Customer_Name,Date,Start_Time,End_Time,Room_Id")
            }
        }
    })
})

// Booked Rooms List
        app.get("/BookedRooms",(req,res)=>{
    try{
        let SecondBooking=[];
        let Roomie ={}
        Bookings.map(data=>{
            Roomie = {
                Room_Id : data.Room_Id,
                Status : data.Status,
                Customer_Name : data.Customer_Name,
                Date : data.Date,
                Start_Time : data.Start_Time,
                End_Time : data.End_Time
            }
            SecondBooking.push(Roomie)
        })
        res.status(200).send(SecondBooking)
    }
    catch(err){
        res.status(400).send(err)
    }
})

// Customer List
app.get("/Customers",(req,res)=>{
    try{
        let SecondBooking=[];
        let client ={}
        Bookings.map(data=>{
            client = {
                Customer_Name : data.Customer_Name,
                Room_Id : data.Room_Id,
                Date : data.Date,
                Start_Time : data.Start_Time,
                End_Time : data.End_Time
            }
            SecondBooking.push(client)
        })
        res.status(200).send(SecondBooking)
    }
    catch(err){
        res.status(400).send(err)
    }
})

// Customer History
app.get("/CustomerHistory",(req,res)=>{
    try{
        let Cust_Hist = {}
        for(let i of Bookings){
            if(Cust_Hist[i.Customer_Name]){
                Cust_Hist[i.Customer_Name]=Cust_Hist[i.Customer_Name]+1
            }
            else{
                Cust_Hist[i.Customer_Name]=1
            }
        }
        for(let client of Object.keys(Cust_Hist)){
            Bookings.unshift(`${client} booked the rooms ${Cust_Hist[client]} times`)
        }
        Bookings.unshift(Cust_Hist)
        res.status(200).send(Bookings)
    }
    catch(err){
        res.status(400).send(err)
    }
})

app.listen(PORT)