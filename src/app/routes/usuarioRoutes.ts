import { Router } from "express";
import UsuariosControllers from "../controllers/UsuariosControllers";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";
import { AutorizarGerente } from "../middlewares/AuthorizationMiddlewares";

const usuarioRoutes = Router();

usuarioRoutes
	.route("/usuario/:id")
	.get(AuthenticationMiddleware, UsuariosControllers.PegarUsuarioPorId)
	.put(AuthenticationMiddleware, AutorizarGerente, UsuariosControllers.AtualizarUsuario)
	.delete(UsuariosControllers.RemoverUsuário);

usuarioRoutes.get("/usuarios", AuthenticationMiddleware, UsuariosControllers.ListarUsuarios);
usuarioRoutes.post("/usuario", AuthenticationMiddleware, AutorizarGerente, UsuariosControllers.CriarUsuario);

export default usuarioRoutes