import { Router } from "express";
import EntidadesControllers from "../controllers/EntidadesControllers";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";

const entidadesRoutes = Router();

entidadesRoutes.get("/entidades", EntidadesControllers.ListarEntidades);

entidadesRoutes.post("/entidade", AuthenticationMiddleware, EntidadesControllers.CriarEntidade);

entidadesRoutes
	.route("/entidade/:id")
	.get(EntidadesControllers.EncontrarEntidadePorId)
	.put(AuthenticationMiddleware, EntidadesControllers.AtualizarEntidade)
	.delete(AuthenticationMiddleware, EntidadesControllers.RemoverEntidade);

export default entidadesRoutes