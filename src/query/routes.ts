import { Router } from "express";

export const routes = Router();

routes.post("/", (req, res) => {
  res.send(req.body);
});
