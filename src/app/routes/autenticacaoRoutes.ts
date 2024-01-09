import { Router } from "express";
import AutenticacaoControllers from "../controllers/AutenticacaoControllers";

const autenticacaoRoutes = Router();

autenticacaoRoutes.post("/login", AutenticacaoControllers.Login);
autenticacaoRoutes.post("/cadastro", AutenticacaoControllers.Cadastro);
autenticacaoRoutes.get("/perfil", AutenticacaoControllers.VisualizarPerfil)
autenticacaoRoutes.put("/perfil/atualizar", AutenticacaoControllers.AtualizarPerfil)
autenticacaoRoutes.post("/esqueceu-senha", AutenticacaoControllers.EsqueceuSenha)
autenticacaoRoutes.put("/recuperar-senha", AutenticacaoControllers.RecuperarSenha)

export default autenticacaoRoutes