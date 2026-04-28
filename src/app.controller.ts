import express from "express";
import type { Express } from "express";
import { authRouter } from "./modules";
import { globalErrorHnadler } from "./middleware/error.middleware";
import { env } from "./config/env.service";
import cors from "cors";
import DBConnection from "./database/connection";
import { redisService } from "./common/services/redis.service";
import userModel from "./database/model/user.model";
export const bootstrap = async () => {
  const app: Express = express();
  app.use(cors(), express.json());

  await DBConnection();
  redisService.connect();
  //------------------------------------
  // create user 
  // let user =new userModel({
  //   firstName: "Jok",
  //   lastName: "Doe",
  //   email: "a0Gdjmas2q1@example.com",
  //   phone: "1234567890",
  //   password: "password",
  // })
  // await user.save()

  let newUser = await userModel.findOne({
    email: "a0Gdjmas2q1@example.com",
    admin: true
  })
  // await user?.updateOne({
  //   firstName: "samyyy",
  //   phone: "1234567890"
  // })


  // let newUser = await userModel.findOne({
  //   email: "a0Gjmas2q@example.com",
  //   admin: true
  // })
  // if(!newUser){
  //   throw new Error("User not created")
  // }
  // newUser.firstName="ahmed"



  //------------------------------------
  app.use("/auth", authRouter);
  app.use(globalErrorHnadler);

  app.listen(env.port, () => {
    console.log(`Server is running on port  ${env.port}`);
  });


}