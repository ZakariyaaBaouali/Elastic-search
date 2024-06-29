import express from "express";
import cors from "cors";
import { PORT } from "./config";
import { SearchEngine } from "./elastic";

//
const app = express();
const searchEngine = new SearchEngine(5);

///
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);

//routes
app.get("/", (req, res) => {
  return res.status(200).send("Server works!!!");
});

app.post("/create-index", async (req, res) => {
  await searchEngine.createIndex();
  return res.status(200).send("index created!!!");
});

app.post("/search/all", async (req, res) => {
  const data = await searchEngine.searchAll();
  return res.status(200).send(data);
});

app.post("/search/full-text", async (req, res) => {
  const name = req.body.name as string;
  const data = await searchEngine.searchProductByName(name);
  return res.status(200).send(data);
});

app.post("/search/auto-complete", async (req, res) => {
  const name = req.body.name as string;
  const data = await searchEngine.autoComplete(name);
  return res.status(200).send(data);
});

app.post("/search/multi", async (req, res) => {
  const name = req.body.name as string;
  const data = await searchEngine.multiSearch(name);
  return res.status(200).send(data);
});

//
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
