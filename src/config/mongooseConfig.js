import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";

dotenv.config();
const url = process.env.DB_URL;
export const connectUsingMongoose = async() =>
{
    try{
    await mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true //new flag they have provided
    });
    console.log("Mongodb connected using mongoose.");
    addCategories();
}
catch(err)
{
   console.log("error while connnecting ot db", err); 
}
}


async function addCategories()
{
    const CategoryModel = mongoose.model('categories', categorySchema);
    const categories = CategoryModel.find();
    if(!categories || (await categories).length ==0)
    {
        await CategoryModel.insertMany([{
            name: 'books'},
            { name: 'Electronics'},
        {name: 'Clothing'}])
    }
    console.log("categories are added");
}