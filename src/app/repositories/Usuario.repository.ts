import Erro from "../../types/Erro";
import Usuario, { Funcao } from "../../types/Usuario";
import UsuarioModel from "../models/Usuario";
import { compararSenha } from "../utils/senhas";

interface FiltrosUsuario {
	dados_administrativos?: {
		entidade_relacionada?: string;
		funcao?: Funcao;
	};
	email?: string;
	nome_completo?: string;
	nome_usuario?: string;
	numero_registro?: string;
}

interface Login{
	nome_usuario: string,
	senha: string
}

class UsuarioRepository {
	static async login(data: Login){
		const usuario = await UsuarioModel.findOne({nome_usuario: data.nome_usuario})
		let senhaCorreta = false

		if(usuario) {
			senhaCorreta = await compararSenha(data.senha, usuario.senha)
		}

		return {
			usuario: usuario?.toObject(),
			senhaCorreta
		}
	}
	static async findUsuario(params: FiltrosUsuario) {
		const usuario = await UsuarioModel.findOne(params, {senha: false});

		return usuario;
	}
	static findUsuarioId(id: any) {}
	static findUsuarios(params: any) {}
	static async createUsuario(data: Usuario) {
		const usuario = new UsuarioModel(data);
		let erro: Erro | undefined = undefined;

		const primeiroUsuario = (await UsuarioModel.find()).length == 0;

		if (primeiroUsuario) {
			usuario.dados_administrativos.funcao = "ADMINISTRADOR";
		}

		const emailExiste = await UsuarioModel.findOne({ email: usuario.email });

		if (emailExiste) {
			erro = {
				codigo: 409,
				erro: { email: "Email já cadastrado" },
			};
		} else {
			try {
				await usuario.save();
			} catch (error: any) {
				const mensagemErro = error.message as string;
				const errosValidacao = error.errors;
				const erros: any = {};
				let codigo = 500;

				if (
					mensagemErro &&
					mensagemErro.includes("Usuario validation failed")
				) {
					codigo = 400;
					Object.keys(errosValidacao).map((k) => {
						erros[k] = errosValidacao[k].message;
					});
				}

				erro = {
					codigo,
					erro: erros,
				};
			}
		}

		return { usuario: usuario.toObject(), erro };
	}
	static updateUsuario(id: string, data: any) {}
	static deleteUsuario(id: string) {}
}

export default UsuarioRepository;
