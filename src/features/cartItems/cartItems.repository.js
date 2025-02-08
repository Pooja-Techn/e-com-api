import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";

class CartItemsRepository {

    constructor()
    {
        this.collection = "cartItems";
    }

    async addProduct(productID, userID, quantity)
    {
        try{
            const db = getDB();
            const collection = db.collection(this.collection)
            const id = await this.getNextCounter(db);
            // find the document
            // either insert or update
            // Insertion.
            console.log("id");
            console.log(id);
            await collection.updateOne(
                {productID: new ObjectId(productID), userID: new ObjectId(userID)},
                {
                    $setOnInsert: {_id:id},
                    $inc:{
                    quantity: quantity
                }},
                {upsert: true})

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }
    async getProduct(userID)
    {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const items = await collection.find({ userID: new ObjectId(userID)}).toArray();   
            return items;
        }
        catch(err)
        {
            console.log(err);
            throw new ApplicationError("something went wrong with database", 500);
        }

    }
    async deleteProduct(cartItemID, userID)
    {
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const result = await collection.deleteOne({ _id: new ObjectId(cartItemID), userID: new ObjectId(userID)});
            return result.deletedCount >0;
        }    
    catch(err)
    {
        console.log(err);
        throw new ApplicationError("something went wrong with database", 500);
    }
}

async getNextCounter(db){

    const resultDocument = await db.collection("counters").findOneAndUpdate(
        {_id:'cartItemId'},
        {$inc:{value: 1}},
        {returnDocument:'after'}
    )  
    console.log(resultDocument.value);
    return resultDocument.value;
}
}
export default CartItemsRepository;