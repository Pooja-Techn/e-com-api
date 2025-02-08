import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
    user: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    likeable:{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'types' //since here it could be products or categories
    },
    types:{
        type: String,
        enum: ['products','categories']
    }
}).pre('save', (next)=>{
    console.log("New like coming in");
    next();
}).post('save', (doc)=>{
    console.log("Like is saved");
    console.log(doc);
})
//in pre hook, first arg is operation, then what we have to do prior
