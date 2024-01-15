import { Router } from "express";
import AutenticacaoControllers from "../controllers/AutenticacaoControllers";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";

const autenticacaoRoutes = Router();

autenticacaoRoutes.post("/login", AutenticacaoControllers.Login);
autenticacaoRoutes.post("/cadastro", AutenticacaoControllers.Cadastro);
autenticacaoRoutes.get("/perfil", AuthenticationMiddleware, AutenticacaoControllers.VisualizarPerfil)
autenticacaoRoutes.put("/perfil/atualizar", AutenticacaoControllers.AtualizarPerfil)
autenticacaoRoutes.post("/esqueceu-senha", AutenticacaoControllers.EsqueceuSenha)
autenticacaoRoutes.put("/recuperar-senha", AutenticacaoControllers.RecuperarSenha)

export default autenticacaoRoutes