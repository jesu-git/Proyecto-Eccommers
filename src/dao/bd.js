import mongoose from "mongoose";



export  const connection = async(link, db) => {

    try {

        await mongoose.connect(link, { dbName: db })
        console.log("BD conectada!")

    } catch(error) {
       
        console.log(error.message)

    }
}