import { Router } from "express";
import UsuariosControllers from "../controllers/UsuariosControllers";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";
import { AutorizarGerente } from "../middlewares/AuthorizationMiddlewares";

const usuarioRoutes = Router();

usuarioRoutes
	.route("/usuario/:id")
	.get(UsuariosControllers.PegarUsuarioPorId)
	.put(UsuariosControllers.AtualizarUsuario)
	.delete(UsuariosControllers.RemoverUsuário);

usuarioRoutes.get("/usuarios", UsuariosControllers.ListarUsuarios);
usuarioRoutes.post("/usuario", AuthenticationMiddleware, AutorizarGerente, UsuariosControllers.CriarUsuario);

export default usuarioRoutes