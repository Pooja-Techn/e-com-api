import { MongoClient } from "mongodb"; 
 import dotenv from "dotenv";

// //the reason we are loading all env var here is 
// //because in server.js this middleware is imported prior loading all env
dotenv.config();

const url = process.env.DB_URL;

let client;
export const connectToMongoDB = () =>{
    MongoClient.connect(url).then(clientInstance =>
    {
        client = clientInstance
        console.log("mongodb is connected."+ client)
        createCounter(client.db()) //when db is connected, it will create counter collection
        createIndexes(client.db());
    }
    )
    .catch( err =>
    {
        console.log(err);
    }
    )
}


export const getClient = () =>{
    return client;
}
export const getDB = () =>
{

    return client.db();
}

const createCounter = async(db)=>{
    //create counter collection 
    const existingCounter=await db.collection("counters").findOne({_id:'cartItemId'});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id:'cartItemId', value:0});
    }
}

const createIndexes = async(db) => {
    try{
    //single field index
    await db.collection("products").createIndex({ price:1});
    //compound index
    await db.collection("products").createIndex({ name:1, category: -1 });
    //text based index
    await db.collection("products").createIndex({desc: "text"});

}
    catch(err)
    {
        console.log(err);
    }
   console.log("Indexes are created."); 
}
//export default connectToMongoDB;
