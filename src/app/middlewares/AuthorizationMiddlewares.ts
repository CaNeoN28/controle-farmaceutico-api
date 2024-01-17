import { RequestHandler } from "express";
import { AuthenticatedRequest } from "../../types/Requests";
import findUsuarioService from "../services/find.usuario.service";

const permissoes = {
	ADMINISTRADOR: 3,
	GERENTE: 2,
	USUARIO: 1,
	INATIVO: 0,
};

const AutorizarGerente: RequestHandler = async function (
	req: AuthenticatedRequest,
	res,
	next
) {
	const userData = req.user!;
	const usuario = await findUsuarioService(userData.id);
	const funcao = usuario.dados_administrativos.funcao

	if(permissoes[funcao] >= 2){
		next()
	} else {
		return res.status(403).send("É preciso ser gerente ou superior para realizar essa ação")
	}
};

export {
	AutorizarGerente
}