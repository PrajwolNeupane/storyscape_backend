import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

var connection;

if(!process.env.MONGODB_URI){
    console.log("Development")
    connection = mongoose.connect(`mongodb+srv://${process.env.DB_OWNER}:${encodeURIComponent(process.env.DB_PASSWORD)}@main.uwszulk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`).then(() => {
        console.log(`Database connected`);
    }).catch((e) => {
        console.log(e.message);
    })
}
else{
    console.log("Production")
    connection = mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
        console.log(`Database connected`);
    }).catch((e) => {
        console.log(e.message);
    })
}
export default  connection;