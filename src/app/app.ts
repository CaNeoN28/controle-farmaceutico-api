import express from "express";
import cors from "cors";
import route from "./routes";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import ConnectDB from "../config/database_config";

const app = express();

function configApp() {
	ConnectDB()
	
	app.use(express.json());
	app.use(cors());

	route(app);

	app.use(ErrorMiddleware);
}

export default app;
export { configApp };
