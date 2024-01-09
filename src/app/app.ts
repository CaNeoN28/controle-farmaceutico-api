import express from "express";
import cors from "cors"
import route from "./routes";

const app = express();

app.use(express.json())
app.use(cors())

route(app)

export default app