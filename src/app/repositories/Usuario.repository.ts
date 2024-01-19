import mongoose from "mongoose";
import Erro from "../../types/Erro";
import Usuario, { Funcao } from "../../types/Usuario";
import UsuarioModel from "../models/Usuario";
import { compararSenha } from "../utils/senhas";
import { erroParaDicionario } from "../utils/mongooseErrors";
import EntidadeRepository from "./Entidade.repository";

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
		if (!mongoose.isValidObjectId(id)) {
			throw {
				codigo: 400,
				erro: "Id inválido",
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
			const nome_entidade =
				"Instituto Federal de Educação de Rondônia - Campus Vilhena";

			let entidadePadrao = await EntidadeRepository.findEntidade({
				nome_entidade,
			});

			if (!entidadePadrao) {
				entidadePadrao = (
					await EntidadeRepository.createEntidade({
						estado: "Rondônia",
						municipio: "Vilhena",
						nome_entidade: nome_entidade,
					})
				).entidade;
			}

			usuario.dados_administrativos = {
				entidade_relacionada: entidadePadrao.id,
				funcao: "ADMINISTRADOR",
			};
		}

		const emailExiste = await UsuarioModel.findOne({ email: usuario.email });
		const nomeExiste = await UsuarioModel.findOne({
			nome_usuario: usuario.nome_usuario,
		});

		if (emailExiste || nomeExiste) {
			erro = {
				codigo: 409,
				erro: {
					email: emailExiste ? "Email já cadastrado" : undefined,
					nome_usuario: nomeExiste
						? "Nome de usuário já cadastrado"
						: undefined,
				},
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
		try {
			let erros: Erro | undefined = undefined;
			let usuario: any = undefined;
			const emailExiste = await UsuarioModel.findOne({
				email: data.email,
				id: { $ne: id },
			});

			const nomeExiste = await UsuarioModel.findOne({
				nome_usuario: data.nome_usuario,
				id: { $ne: id },
			});

			if (emailExiste || nomeExiste) {
				erros = {
					codigo: 409,
					erro: {
						email: emailExiste ? "Email já cadastrado" : undefined,
						nome_usuario: nomeExiste
							? "Nome de usuário já cadastrado"
							: undefined,
					},
				};
			} else {
				usuario = await UsuarioModel.findByIdAndUpdate(id, data, {
					fields: { senha: false },
					new: true,
					runValidators: true,
				});

				if (!usuario) {
					erros = {
						codigo: 404,
						erro: "Usuário não encontrado",
					};
				}
			}

			return {
				usuario,
				erros,
			};
		} catch (error) {
			const { erros, codigo } = erroParaDicionario("Usuario", error);

			return {
				codigo,
				erros: {
					codigo,
					erro: erros,
				},
			};
		}
	}
	static deleteUsuario(id: string) {}
}

export default UsuarioRepository;
