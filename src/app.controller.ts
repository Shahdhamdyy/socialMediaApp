import express from "express";
import type { Express } from "express";
import { authRouter } from "./modules";
import { globalErrorHnadler } from "./middleware/error.middleware";
import { env } from "./config/env.service";
import cors from "cors";
import DBConnection from "./database/connection";
export const bootstrap = async () => {
  const app: Express = express();
  app.use(cors(), express.json());

  await DBConnection();
  app.use("/auth", authRouter);
  app.use(globalErrorHnadler);

  app.listen(env.port, () => {
    console.log(`Server is running on port  ${env.port}`);
  });


}