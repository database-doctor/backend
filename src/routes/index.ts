import { Router } from "express";
import { routes as queryRoutes } from "./query";


export const routes = Router();

routes.use("/query", queryRoutes);