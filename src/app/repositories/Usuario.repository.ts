import mongoose from "mongoose";
import Erro from "../../types/Erro";
import Usuario, { Funcao } from "../../types/Usuario";
import UsuarioModel from "../models/Usuario";
import { compararSenha } from "../utils/senhas";
import { erroParaDicionario } from "../utils/mongooseErrors";

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

interface Login {
	nome_usuario: string;
	senha: string;
}

class UsuarioRepository {
	static async login(data: Login) {
		const usuario = await UsuarioModel.findOne({
			nome_usuario: data.nome_usuario,
		});
		let senhaCorreta = false;

		if (usuario) {
			senhaCorreta = await compararSenha(data.senha, usuario.senha);
		}

		return {
			usuario: usuario?.toObject(),
			senhaCorreta,
		};
	}
	static async findUsuario(params: FiltrosUsuario) {
		const usuario = await UsuarioModel.findOne(params, { senha: false });

		return usuario;
	}
	static async findUsuarioId(id: any) {
		if (!mongoose.isValidObjectId) {
			throw {
				codigo: 400,
				erro: ["Id inválido"],
			} as Erro;
		}

		const usuario = await UsuarioModel.findById(id, { senha: false });

		return usuario;
	}
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
				const { erros, codigo } = erroParaDicionario("Usuario", error);

				erro = {
					codigo,
					erro: erros,
				};
			}
		}

		return { usuario: usuario.toObject(), erro };
	}
	static async updateUsuario(id: string, data: any) {
		let usuario = await UsuarioModel.findById(id);
		const erro: Erro | undefined = undefined;

		if (usuario) {
			try {
				await usuario.updateOne(data);

				await usuario.save();

				usuario = await UsuarioModel.findById(id, { senha: false })!;

				return {
					usuario,
					erro: undefined,
				};
			} catch (err) {}
		}
		return {
			usuario,
			erro: "Usuário não encontrado",
		};
	}
	static deleteUsuario(id: string) {}
}

export default UsuarioRepository;
