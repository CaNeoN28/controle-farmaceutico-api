import { Application } from "express";
import autenticacaoRoutes from "./autenticacaoRoutes";
import usuarioRoutes from "./usuarioRoutes";
import entidadesRoutes from "./entidadesRoutes";
import farmaciaRoutes from "./farmaciaRoutes";
import imagemRouter from "./imagemRoutes";

const route = (app: Application) => {
	app.route("/").get((req, res) => {
		res.send("Bem vindo");
	});

	app.use(
		autenticacaoRoutes,
		farmaciaRoutes,
		entidadesRoutes,
		usuarioRoutes,
		imagemRouter
	);

	app.get("*", (req, res) => {
		res.status(404).sendFile("views/error404.html", { root: __dirname });
	});
};

export default route;
