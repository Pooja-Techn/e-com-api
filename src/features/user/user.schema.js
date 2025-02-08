import mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
    name: { type: String, maxLength: [25, "Name can't be greater than 25 characters."]},
    email: { type: String, unique: true, required: true,
        match: [/.+\@.+\../,"Please provide valid mail"] //\. some content then @ ./ some content then dot
    },
    password: {
        type: String,
        //customvalidator
        validate: {
            validator: function(value)
            {
                return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
                //return /^[A-Za-z]+$/.test(value)
                
            },
            message: "Password should be between 8-12 chr and contains special char"
        }
    },
    type: { type: String, enum: ['Customer', 'Seller']} 
})