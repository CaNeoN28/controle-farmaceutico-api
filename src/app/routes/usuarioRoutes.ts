import { Router } from "express";
import UsuariosControllers from "../controllers/UsuariosControllers";

const usuarioRoutes = Router();

usuarioRoutes
	.route("/usuario/{id}")
	.get(UsuariosControllers.PegarUsuarioPorId)
	.put(UsuariosControllers.AtualizarUsuario)
	.delete(UsuariosControllers.RemoverUsuário);

usuarioRoutes.get("/usuarios", UsuariosControllers.ListarUsuarios);
usuarioRoutes.post("/usuario", UsuariosControllers.CriarUsuario);

export default usuarioRoutes