import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";
export default class OrderRepository
{
    constructor()
    {
        this.collection = "orders";
    }
    async placeOrder(userId)
    {
        const client = getClient();
        const session = client.startSession(); ///start the session associated with client

        try{
           
            const db = getDB();
            session.startTransaction(); //collectinoof db operation which needs to perform
        //1. Get careitem and caluclate total amount
        const items = await this.getTotalAmount(userId, session);
        const finalTotalAmount = items.reduce((acc, item)=> acc+ item.totalAmount, 0)
        console.log(items);
        //2. create an order record
        const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount,new Date());
        await db.collection(this.collection).insertOne(newOrder,{session})
        //3.Reduce the stock
        for(let item of items)
        {
            await db.collection("products").updateOne(
                {_id: item.productID },
                {$inc:{ stock: -item.quantity}},{session}
            )
        }
        //throw new Error("Something is wrong in placeOrder"); // if any error occur this won't let other code execute. hence we need transaction
        //4. Clear the cart items
        await db.collection("cartItems").deleteMany({
            userID: new ObjectId(userId)
        },{session});
        session.commitTransaction(); //update the db once complete all transaction
        session.endSession(); //end the session
        return;
        }
        catch(err)
        {
            await session.abortTransaction();
            session.endSession();
            console.log(err);
            throw new ApplicationError("Something went wrong withh database", 500)
        }

    }
    async getTotalAmount(userId, session)
    {
        const db = getDB();
        const items = await db.collection("cartItems").aggregate([
            //1. get cartitem for user
           { $match:{
                userID: new ObjectId(userId)}
            },
        //2. Get the products form products collection
        {
            $lookup :{
                from: "products",
                localField:"productID",
                foreignField: "_id",
                as: "productInfo"
            }
        },
    //3. Unwind the productinfo.
    {
        $unwind: "$productInfo"
    },
    //4. calculate total amount, add in cartItems
    {
        $addFields: {
            "totalAmount":{ $multiply: ["$productInfo.price", "$quantity"]}

        }
    }
    ], {session}).toArray();
    //sum of all item of all cart items
    return items;
    }
}
