import express from 'express';
import DBConnection from './modal/index.js';
import cors from 'cors';
import * as url from 'url';
import userRoute from './route/userRoute.js';
import createrRoute from './route/creatorRoute.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*"
}));

app.use("/api/v2/user", userRoute);
app.use("/api/v2/creater", createrRoute);



app.listen(process.env.PORT || 8000, async () => {
    console.log("Server Started");
    try {
        await DBConnection;
    } catch (e) {
        console.log(e);
    }
})