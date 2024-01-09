import express, { Application } from "express";
import autenticacaoRoutes from "./autenticacaoRoutes";
import usuarioRoutes from "./usuarioRoutes";
import entidadesRoutes from "./entidadesRoutes";
import farmaciaRoutes from "./farmaciaRoutes";

const route = (app: Application) => {
	app.route("/").get((req, res) => {
		res.send("Bem vindo");
	});

	app.use(
		express.json(),
		autenticacaoRoutes,
		farmaciaRoutes,
		entidadesRoutes,
		usuarioRoutes
	);
};

export default route;
