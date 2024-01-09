import express, { Application } from "express";
import autenticacaoRoutes from "./autenticacaoRoutes";
import usuarioRoutes from "./usuarioRoutes";
import entidadesRoutes from "./entidades";

const route = (app: Application) => {
	app.route("/").get((req, res) => {
		res.send("Bem vindo")
	})

	app.use(
		express.json(),
		autenticacaoRoutes,
		usuarioRoutes,
		entidadesRoutes
	)
}

export default route