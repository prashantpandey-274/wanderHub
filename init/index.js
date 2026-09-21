const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing  = require("../models/listing.js");

// database connection part

async function main (){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderHub");

}

main().then((res)=>{
    console.log("connection successfull with database!");
    
}).catch((err)=>{
    console.log(err);
});

// inserting multiple entries in database

const initDB = async ()=>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj,owner:"6aa1a9ac527e4990611074a0"}))
  await Listing.insertMany(initData.data).then((res)=>{
    console.log("data was initalised!!");
  }).catch((err)=>{
    console.log(err);
  });
}

initDB();