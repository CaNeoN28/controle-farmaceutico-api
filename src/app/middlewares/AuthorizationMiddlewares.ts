import { RequestHandler } from "express";
import { AuthenticatedRequest } from "../../types/Requests";
import findUsuarioService from "../services/find.usuario.service";
import PERMISSOES from "../utils/permissoes";

const AutorizarGerente: RequestHandler = async function (
	req: AuthenticatedRequest,
	res,
	next
) {
	const userData = req.user!;
	const usuario = await findUsuarioService(userData.id);
	const funcao = usuario.dados_administrativos.funcao

	if(PERMISSOES[funcao] >= 2){
		next()
	} else {
		return res.status(403).send("É necessário ser gerente ou superior para realizar esta ação")
	}
};

export {
	AutorizarGerente
}