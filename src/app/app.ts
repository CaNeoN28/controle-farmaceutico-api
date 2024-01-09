import express from "express";
import cors from "cors"
import route from "./routes";
import ConnectDB from "../config/database_config";

const app = express();

ConnectDB()

app.use(express.json())
app.use(cors())

route(app)

export default app