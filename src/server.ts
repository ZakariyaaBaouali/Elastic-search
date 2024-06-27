import express from "express";
import cors from "cors";
import { PORT } from "./config";

//
const app = express();

///
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);

//
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
