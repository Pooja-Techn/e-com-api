import { likeSchema } from "./like.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const LikeModel = mongoose.model('likes',likeSchema)

export class LikeRepository{  

    async likeProduct(userId, productId)
    {
        try{
        const newLike = new LikeModel({
            user: new ObjectId(userId),
            likeable: new ObjectId(productId),
            types: 'products'
        });
        await newLike.save();
    }
    catch(err)
    {
        console.log(err);

    }    }

    async likeCategory(userId, categoryId)
    {
        try{
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                types: 'categories'
            });
            await newLike.save();
        }
        catch(err)
        {      console.log(err);
    
        }
    }

    async getLikes(type, id){
        return await LikeModel.find({
            likeable: new ObjectId(id),
            types: type
        }).populate('user').populate({path: 'likeable', model: type})
    }

}
