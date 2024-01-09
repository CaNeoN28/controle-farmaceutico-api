import { Types } from "mongoose";

type Funcao = "ADMINISTRADOR" | "GERENTE" | "USUARIO" | "INATIVO"
interface IUsuario {
	nome_completo: String;
	nome_usuario: String;
	email: String;
	cpf: String;
	numero_registro: String;
	senha: String;
	imagem_url?: String;
	dados_administrativos: {
		funcao?: Funcao;
		entidade_relacionada: Types.ObjectId;
	};
}

class Usuario implements IUsuario {
	nome_completo: String;
	nome_usuario: String;
	email: String;
	cpf: String;
	numero_registro: String;
	senha: String;
	imagem_url?: String;
	dados_administrativos: { funcao?: Funcao; entidade_relacionada: Types.ObjectId };

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
		} = usuario;

		this.cpf = cpf;
		this.dados_administrativos = {
			entidade_relacionada: dados_administrativos.entidade_relacionada,
			funcao: dados_administrativos.funcao || "INATIVO",
		};
		this.email = email;
		this.imagem_url = imagem_url;
		this.nome_completo = nome_completo;
		this.nome_usuario = nome_usuario;
		this.numero_registro = numero_registro;
		this.senha = senha;
	}
}

export default Usuario
export {IUsuario, Funcao}