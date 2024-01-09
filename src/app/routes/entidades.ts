import { Router } from "express";
import EntidadesControllers from "../controllers/EntidadesControllers";

const entidadesRoutes = Router();

entidadesRoutes.get("/entidades", EntidadesControllers.ListarEntidades);

entidadesRoutes.post("/entidade", EntidadesControllers.CriarEntidade);

entidadesRoutes
	.route("/entidade/{id}")
	.get(EntidadesControllers.EncontrarEntidadePorId)
	.put(EntidadesControllers.AtualizarEntidade)
	.delete(EntidadesControllers.RemoverEntidade);

export default entidadesRoutes