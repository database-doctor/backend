import { Router } from "express";
import { routes as queryRoutes } from "./query";
import { routes as optimizationRoutes } from "./optimization";


export const routes = Router();

routes.use("/query", queryRoutes);
routes.use("/optimization", optimizationRoutes);