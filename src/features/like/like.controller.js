import { LikeRepository } from "./like.respository.js";

export default class LikeController{
    
    constructor(){
        this.likeRepository = new LikeRepository();
    }
    async likeItem(req, res, next)
    {
        try{
            const {id, type} = req.body;
            const userId = req.userId;
            if(type!='products' && type!='categories'){
                return res.status(400).send('Invalid type');
            }
            if(type=='products'){
                this.likeRepository.likeProduct(userId, id)

            }
            else{
                this.likeRepository.likeCategory(userId, id);
            }
                return res.status(200).send("Item is liked")
        }
        catch(err)
        {
            console.log(err)
            next(err)
            
        }
    }


    async getLikes(req, res, next){
        try{
            const {id, type} = req.query; //id is product or categoryid
            const likes = await this.likeRepository.getLikes(type, id);
            return res.status(200).send(likes);
        }
        catch(err)
        {
            console.log(err);
            next(err);
            //return res.status(200).send("Something went wrong.");
        }
    }
}