import mongoose from "mongoose";
import { env } from "../config/env.service";
const DBConnection = () => {
    mongoose.connect(env.mongoURL).then(() => {
        console.log("Mongo DB Connected");
    }).catch((err) => {
        console.log("Mongo DB Connection Failed", err);
    })

}

export default DBConnection;

