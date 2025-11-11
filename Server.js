const express=require("express")
const app=express();
require('dotenv').config()
const cors=require("cors");

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

    
let mysql = require("mysql2");

let connection = mysql.createConnection({
  host:process.env. DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL server...");

  connection.query("CREATE DATABASE IF NOT EXISTS mydb", (err) => {
    if (err) throw err;
    console.log(" Database 'mydb' created ");
    connection.end();
  });


});




app.use(cors());
app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body; 

    const user = await prisma.user.create({
      data: { name, email },
    });

    res.status(201).json({ message: "User added successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.get("/users",async(req,res)=>{
    try{
    const user= await prisma.user.findMany()
    res.status(202).json(user)
    }catch(err){
        console.log(err);
        res.status(500).json({error:"something went wrong"})
    }
    
});
app.get("/users/:id",async(req,res)=>{
    try{
        const id=Number(req.params.id);
        const user=await prisma.user.findUnique({
            where:{
                id:id
            }
        })
        
        if(!user){
            res.status(404).json({error:"user not found"})
            
        }
        res.json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"})
        
    }
});

app.put("/users/:id",async(req,res)=>{
    try{
        const id=Number(req.params.id) ;
    const user=await prisma.user.update({
        where:{id:id},
        data:req.body
        
    }) 
    res.json({message:`user with id ${id} successfully updated`,user});

    
    
  }catch(err){
    console.log(err);
    res.status(500).json({message:"something went wrong"})
    
  }
});

app.delete("/users/:id",async(req,res)=>{
    try{
        const id=Number(req.params.id);
        const user=await prisma.user.delete({
            where:{
                id:id},
            
        })
      
        
        res.json({message:`user with ${id} is deleted`,user})
        
        
    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"})
        
    }
});


app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
});