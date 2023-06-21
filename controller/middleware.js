import * as dotenv from 'dotenv';
dotenv.config()

export const checkKey  = async (req, res, next) => {
    const api_key = req.headers.api_key;
    if (api_key) {
        if (api_key === process.env.API_KEY) {
            next();
        }else{
            return res.send({ message: "Invalid Api Key"}); 
        }
    } else {
        return res.send({ message: "Api Key not Provided" });
    }
} 
export default checkKey;