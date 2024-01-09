import express, { Application } from "express";
import autenticacaoRoutes from "./autenticacaoRoutes";

const route = (app: Application) => {
	app.route("/").get((req, res) => {
		res.send("Bem vindo")
	})

	app.use(
		express.json(),
		autenticacaoRoutes
	)
}

export default route