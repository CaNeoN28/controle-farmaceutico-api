import { Types } from "mongoose";

type Funcao = "ADMINISTRADOR" | "GERENTE" | "USUARIO" | "INATIVO";
interface IUsuario {
	nome_completo: string;
	nome_usuario: string;
	email: string;
	cpf: string;
	numero_registro: string;
	senha: string;
	imagem_url?: string;
	token?: string;
	dados_administrativos?: {
		funcao?: Funcao;
		entidade_relacionada: Types.ObjectId;
	};
}

interface FiltrosUsuario {
	nome_usuario?: RegExp | string;
	cpf?: RegExp | string;
	funcao?: string;
	entidade_relacionada?: string;
}

class Usuario implements IUsuario {
	nome_completo: string;
	nome_usuario: string;
	email: string;
	cpf: string;
	numero_registro: string;
	senha: string;
	imagem_url?: string;
	dados_administrativos?: {
		funcao?: Funcao;
		entidade_relacionada: Types.ObjectId;
	};
	token_recuperacao?: string | undefined;

	constructor(usuario: Usuario) {
		const {
			cpf,
			dados_administrativos,
			email,
			imagem_url,
			nome_completo,
			nome_usuario,
			numero_registro,
			senha,
			token_recuperacao,
		} = usuario;

		this.cpf = cpf;

		if (dados_administrativos) {
			this.dados_administrativos = {
				entidade_relacionada:
					dados_administrativos && dados_administrativos.entidade_relacionada,
				funcao: dados_administrativos.funcao || "INATIVO",
			};
		}
		this.email = email;
		this.imagem_url = imagem_url;
		this.nome_completo = nome_completo;
		this.nome_usuario = nome_usuario;
		this.numero_registro = numero_registro;
		this.senha = senha;
		this.token_recuperacao = token_recuperacao;
	}
}

export default Usuario;
export { IUsuario, Funcao, FiltrosUsuario };
