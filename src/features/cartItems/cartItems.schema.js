import mongoose from "mongoose";

export const cartSchema = new Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products' //which collection it refer to
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' //which collection it refer to


    },
    quantity: Number
})