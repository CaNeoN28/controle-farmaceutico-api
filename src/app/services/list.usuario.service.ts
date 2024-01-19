import { FiltrosUsuario } from "../../types/Usuario";
import UsuarioRepository from "../repositories/Usuario.repository";
import { extrairPaginacao } from "../utils/paginacao";

async function listUsuariosService(params: any) {
	const { entidade_relacionada, cpf, funcao, nome_usuario }: FiltrosUsuario =
		params;
	const filtros: any = {};

	if (cpf) {
		filtros.cpf = new RegExp(cpf);
	}
	if (nome_usuario) {
		filtros.nome_usuario = new RegExp(nome_usuario);
	}
	if (entidade_relacionada) {
		filtros.dados_administrativos = {
			entidade_relacionada,
		};
	}
	if (funcao) {
		filtros.dados_administrativos = {
			...filtros.dados_administrativos,
			funcao,
		};
	}

	const { limite, pagina } = extrairPaginacao(params);

	const paginacao = {
		limite: limite || 10,
		pagina: pagina || 1,
	};

	const resposta = await UsuarioRepository.findUsuarios(filtros, paginacao);

	return resposta
}

export default listUsuariosService;
