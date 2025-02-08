import {ObjectId} from 'mongodb';
import { getDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import mongoose from 'mongoose';
import { productSchema } from './product.schema.js';
import { reviewSchema } from './review.schema.js';
import { categorySchema } from './category.schema.js';

const ProductModel = mongoose.model('products',productSchema )
const ReviewModel = mongoose.model('reviews', reviewSchema )
const CategoryModel = mongoose.model('categories', categorySchema);

class ProductRepository{

    constructor(){
        this.collection = "products";
    }
 
    // async add(newProduct){
    //     try{
    //         // 1 . Get the db.
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         await collection.insertOne(newProduct);
    //         return newProduct;
    //     } catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }
    async add(productData){
        try{
            // 1. Add the product
            productData.categories = productData.category.split(',').map(e => e.trim());
            const newProduct = new ProductModel(productData);
             const savedProduct=await newProduct.save() // to add this in db
           
             //2. Update categories
            await CategoryModel.updateMany(
                {_id: {$in : productData.categories}},
                {
                    $push: { products:new ObjectId(savedProduct._id)} //add newly created product id for category
                }
            )
       
            } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async getAll(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const products = await collection.find().toArray();
            console.log(products);
            return products;
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async get(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({_id: new ObjectId(id)});
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    // async filter(minPrice, maxPrice, category){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         let filterExpression={};
    //         if(minPrice){
    //             filterExpression.price = {$gte: parseFloat(minPrice)}
    //         }
    //         if(maxPrice){
    //             filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
    //         }
    //         if(category){
    //             filterExpression.category=category;
    //         }
    //         return await collection.find(filterExpression).toArray();
            
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }

    // async rate(userID, productID, rating){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         // 1. Find the product
    //         const product = await collection.findOne({_id:new ObjectId(productID)})
    //         // 2. Find the rating
           
    //         const userRating = await product?.ratings?.find(r=>r.userID==userID);
    //         if(userRating){
    //         // 3. Update the rating
    //         await collection.updateOne({
    //             _id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)
    //         },{
    //             $set:{
    //                 "ratings.$.rating":rating
    //             }
    //         }
    //         );
    //         }else{
    //             await collection.updateOne({
    //                 _id:new ObjectId(productID)
    //             },{
    //                 $push: {ratings: {userID:new ObjectId(userID), rating}}
    //             })
    //         }
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }

    // async rate(userID, productID, rating){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         //1. Find the product
    //         const product = await collection.findOne({_id: new ObjectId(productID)})
    //         //2. Find user rating
    //         const userRating = product?.ratings?.find(r => r.userID == userID)
            
    //         if(userRating){
    //             //3. Update exisitng rating
                
    //         await collection.updateOne({
    //             _id:new ObjectId(productID), "ratings.userID": new ObjectId(userID)
    //         },{
    //             //$. will give first matched entry
    //            $set: { "ratings.$.rating": rating}
    //         })
    //         }
    //         else{

    //         // 2. Add new entry
            
    //         await collection.updateOne({
    //             _id:new ObjectId(productID)
    //         },{
    //             $push: {ratings: {userID:new ObjectId(userID), rating}}
    //         })
    //     }
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }
    async filter(minPrice, maxPrice, category){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression={};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            if(maxPrice){
                filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
            }
            if(category){
                filterExpression.category=category;
            }
            return await collection.find(filterExpression).project({name:1, price:1, _id:0, ratings: {$slice:1}}).toArray();
            
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    // async rate(userID, productID, rating){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         // 1. Find the product
    //         const product = await collection.findOne({_id:new ObjectId(productID)})
    //         // 2. Find the rating
           
    //         const userRating = await product?.ratings?.find(r=>r.userID==userID);
    //         if(userRating){
    //         // 3. Update the rating
    //         await collection.updateOne({
    //             _id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)
    //         },{
    //             $set:{
    //                 "ratings.$.rating":rating
    //             }
    //         }
    //         );
    //         }else{
    //             await collection.updateOne({
    //                 _id:new ObjectId(productID)
    //             },{
    //                 $push: {ratings: {userID:new ObjectId(userID), rating}}
    //             })
    //         }
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }

  
    // async rate(userID, productID, rating){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         //1. remove exisitng entry
    //         await collection.updateOne({
    //             _id:new ObjectId(productID)
    //         },{
    //             $pull: {ratings: {userID:new ObjectId(userID)}}
    //         })

    //         // 2. Add new entry  
    //         await collection.updateOne({
    //             _id:new ObjectId(productID)
    //         },{
    //             $push: {ratings: {userID:new ObjectId(userID)}}
    //         })
        
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database", 500);
    //     }
    // }

    async rate(userID, productID, rating){
        try{
            //1. Check if product exist
            const productToUpdate = await ProductModel.findById(productID); //get product
            if(!productToUpdate)
            {
                throw new Error("product not found");
            }
            //2. Get the existing review
            const userReview = await ReviewModel.findOne({
                product: new ObjectId(productID), user: new ObjectId(userID)
            })
            if(userReview)
            {
                userReview.rating = rating;
                await userReview.save();
            }
            else{
                //3. create new if not exist
                const newReview = new ReviewModel({
                    product: new ObjectId(productID),
                    user: new ObjectId(userID),
                    rating: rating
                })
                newReview.save();
            }        
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }




    async averageProductPricePerCategory()
    {
        try{
            const db = getDB();
            return await db.collection(this.collection).aggregate(
               [{
                //Stage1: Get Average price per category
                $group: {
                    _id: "$category",
                    averagePrice: {$avg: "$price"}
                }
               } ]
            ).toArray();
        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }
}

export default ProductRepository;