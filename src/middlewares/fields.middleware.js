import { statusCodes } from "../controllers/codes";


function credentials(req, res, next){
    try{
        const {username, password} = req.body;
        if(!username || !password){
            return res.status(statusCodes.clientError.badReq).json({message:"username or password fields are empty 啊呀🤦‍♂️"});
        }
        next();
    }catch(error){
        return res.status(statusCodes.clientError.badReq).json({message:"Missing username or password，请， 写吧！🐒"});
    }
}
module.exports = credentials;