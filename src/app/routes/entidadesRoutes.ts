import { Router } from "express";
import EntidadesControllers from "../controllers/EntidadesControllers";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";
import { AutorizarGerente } from "../middlewares/AuthorizationMiddlewares";

const entidadesRoutes = Router();

entidadesRoutes.get("/entidades", EntidadesControllers.ListarEntidades);

entidadesRoutes.post("/entidade", AuthenticationMiddleware, AutorizarGerente, EntidadesControllers.CriarEntidade);

entidadesRoutes
	.route("/entidade/:id")
	.get(EntidadesControllers.EncontrarEntidadePorId)
	.put(AuthenticationMiddleware, AutorizarGerente, EntidadesControllers.AtualizarEntidade)
	.delete(AuthenticationMiddleware, EntidadesControllers.RemoverEntidade);

export default entidadesRoutes