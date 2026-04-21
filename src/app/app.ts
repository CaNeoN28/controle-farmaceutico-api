import express from "express";
import cors from "cors";
import route from "./routes";
import ErrorMiddleware from "./middlewares/ErrorMiddleware";
import ConnectDB from "../config/database_config";

const app = express();

function configApp(DB_NAME?: string) {
	ConnectDB(DB_NAME)

	app.use(express.json());
	app.use(cors());

	route(app);

	app.use(ErrorMiddleware);
}

export default app;
export { configApp };
