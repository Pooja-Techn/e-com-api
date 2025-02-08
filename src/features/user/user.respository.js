import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import ApplicationError from "../../error-handler/applicationError.js";

//creating model from schema
const UserModel =  mongoose.model(
    'users', userSchema

);

export default class UserRepository{


    async resetPassword(userID, hashedPassword)
    {
        try{
            let user = await UserModel.findById(userID);
            if(user){
            user.password = hashedPassword;
            user.save();
            }
            else{
                throw new Error("no such user found");
            }

        }
        catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
          }
    }
    async signUp(user)
    {
        try{
        //create instance of model.
        const newUser = new UserModel(user);
        await newUser.save();
        return newUser;
        }
        catch(err)
        {
            //error should in postman rahter than console
            if(err instanceof mongoose.Error.ValidationError)
            {
                throw err;
            }
            else{           
            console.log(err);
            throw new ApplicationError("Something went wrong ", 500);
        }}

    }
    async signIn(email, password)
    {
        try{
            return await UserModel.findOne({ email, password})

        }
        catch(err)
        {
            console.log(err);
            throw new ApplicationError("Something went wrong ", 500);
        }
    }
    async findByEmail(email) {
        try{      
        // 3. Find the document.
        return await UserModel.findOne({email});
        } catch(err){
          console.log(err);
          throw new ApplicationError("Something went wrong with database", 500);
        }
      }
}