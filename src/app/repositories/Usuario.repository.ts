import mongoose from "mongoose";
import Erro from "../../types/Erro";
import Usuario, { Funcao } from "../../types/Usuario";
import UsuarioModel from "../models/Usuario";
import { compararSenha } from "../utils/senhas";
import { erroParaDicionario } from "../utils/mongooseErrors";
import EntidadeRepository from "./Entidade.repository";
import { Paginacao } from "../../types/Paginacao";
import { calcularPaginas } from "../utils/paginacao";
import PERMISSOES from "../utils/permissoes";
import { validarID } from "../utils/validators";

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
		const usuario = await UsuarioModel.findOne(params, {
			senha: false,
		}).populate("dados_administrativos.entidade_relacionada");

		return usuario;
	}
	static async findUsuarioId(id: any) {
		if (!mongoose.isValidObjectId(id)) {
			throw {
				codigo: 400,
				erro: "Id inválido",
			} as Erro;
		}

		const usuario = await UsuarioModel.findById(id, {
			senha: false,
			token_recuperacao: false,
		}).populate("dados_administrativos.entidade_relacionada");

		return usuario;
	}
	static async findUsuarios(
		filtros: FiltrosUsuario,
		paginacao: Paginacao,
		idLogado: string
	) {
		const { limite, pagina } = paginacao;

		const documentos_totais = await UsuarioModel.countDocuments(filtros);
		const pular = limite * (pagina - 1);
		const paginas_totais = calcularPaginas(documentos_totais, limite);

		const usuarios = await UsuarioModel.find(
			{ ...filtros, _id: { $ne: idLogado } },
			{
				senha: false,
				token_recuperacao: false,
			}
		)
			.limit(limite)
			.skip(pular)
			.populate("dados_administrativos.entidade_relacionada");

		return {
			dados: usuarios,
			documentos_totais,
			limite,
			pagina,
			paginas_totais,
		};
	}
	static async createUsuario(data: Usuario, criadorId?: string) {
		const criador = await UsuarioModel.findById(criadorId);
		const usuario = new UsuarioModel(data);
		let erro: Erro | undefined = undefined;

		if (
			criador &&
			data.dados_administrativos &&
			data.dados_administrativos.funcao
		) {
			const nivelCriador = PERMISSOES[criador.dados_administrativos.funcao];
			const nivelUsuario = PERMISSOES[data.dados_administrativos.funcao];

			if (nivelCriador < nivelUsuario) {
				erro = {
					codigo: 403,
					erro: {
						"dados_administrativos.funcao":
							"Não é possível criar um usuário com nível maior que o seu",
					},
				};

				return { usuario, erro };
			}
		}

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
	static async updateUsuario(id: string, data: any, idGerenciador: string) {
		let usuario = await UsuarioModel.findById(id);
		let gerenciador = (await UsuarioModel.findById(idGerenciador))!;
		let erro: Erro | undefined = undefined;

		const emailExiste = await UsuarioModel.findOne({
			email: data.email,
			_id: { $ne: id },
		});

		const nomeUsuarioExiste = await UsuarioModel.findOne({
			nome_usuario: data.nome_usuario,
			_id: { $ne: id },
		});

		if (nomeUsuarioExiste || emailExiste) {
			erro = {
				codigo: 409,
				erro: {
					email: emailExiste ? "Email já cadastrado" : undefined,
					nome_usuario: nomeUsuarioExiste
						? "Nome de usuário já cadastrado"
						: undefined,
				},
			};
		} else {
			try {
				if (usuario) {
					const DA_ANTIGOS = usuario.dados_administrativos;
					let DA_NOVOS = data.dados_administrativos;

					if (DA_NOVOS) {
						DA_NOVOS = {
							funcao: DA_NOVOS.funcao || DA_ANTIGOS.funcao,
							entidade_relacionada:
								DA_NOVOS.entidade_relacionada ||
								DA_ANTIGOS.entidade_relacionada,
						};

						data.dados_administrativos = DA_NOVOS;
					}

					let permissaoNova = undefined;

					if (data.dados_administrativos && data.dados_administrativos.funcao) {
						permissaoNova = PERMISSOES[data.dados_administrativos.funcao];
					}

					const permissaoUsuario =
						PERMISSOES[usuario.dados_administrativos.funcao];
					const permissaoGerenciador =
						PERMISSOES[gerenciador.dados_administrativos.funcao];

					if (permissaoNova && permissaoNova > permissaoGerenciador) {
						erro = {
							codigo: 403,
							erro: {
								"dados_administrativos.funcao":
									"Não foi possível alterar a função do usuário",
							},
						};
					} else if (permissaoGerenciador < permissaoUsuario) {
						erro = {
							codigo: 403,
							erro: "Não é possível alterar os dados de um usuário de nível superior",
						};
					} else {
						await usuario.updateOne(data, { runValidators: true });

						usuario = await UsuarioModel.findById(id, {
							senha: false,
							token_recuperacao: false,
						})!;
					}
				} else {
					erro = {
						codigo: 404,
						erro: "Usuário não encontrado",
					};
				}
			} catch (error) {
				const { codigo, erros } = erroParaDicionario("Usuário", error);

				erro = {
					codigo: codigo,
					erro: erros,
				};
			}
		}

		return { usuario, erros: erro };
	}
	static async selfUpdateUsuario(id: string, data: any) {
		try {
			let erros: Erro | undefined = undefined;
			let usuario: any = undefined;
			const emailExiste = await UsuarioModel.findOne({
				email: data.email,
				_id: { $ne: id },
			});

			const nomeExiste = await UsuarioModel.findOne({
				nome_usuario: data.nome_usuario,
				_id: { $ne: id },
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
					fields: { senha: false, token_recuperacao: false },
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
	static async deleteUsuario(id: string, idGerenciador: string) {
		let erro: Erro | undefined = undefined;
		let usuario: any = undefined

		if (!validarID<string>(id)) {
			erro = {
				codigo: 400,
				erro: "Id inválido",
			};
		} else {
			usuario = await UsuarioModel.findById(id);
			const gerenciador = (await UsuarioModel.findById(idGerenciador))!;

			if (!usuario) {
				erro = {
					codigo: 404,
					erro: "Usuário não encontrado",
				};
			} else {
				const funcaoGerenciador =
					PERMISSOES[gerenciador.dados_administrativos.funcao];
				const funcaoUsuario = PERMISSOES[usuario.dados_administrativos.funcao];

				if (funcaoUsuario > funcaoGerenciador) {
					erro = {
						codigo: 403,
						erro: "Não é possível remover um usuário de nível superior",
					};
				} else {
					await usuario.deleteOne();
				}
			}
		}

		return {erro, usuario};
	}
	static async verificarToken(nome_usuario: string) {
		const usuario = await UsuarioModel.findOne({ nome_usuario });

		return {
			usuario,
		};
	}
	static async recuperarSenha(id: string, token: string, senha: string) {
		try {
			let erros: Erro | undefined = undefined;
			const usuario = await UsuarioModel.findById(id);

			if (
				usuario &&
				usuario.token_recuperacao &&
				usuario.token_recuperacao === token
			) {
				await usuario.updateOne({
					senha,
					token_recuperacao: null,
				});
			} else {
				erros = {
					codigo: 400,
					erro: "Token de recuperação inválido",
				};
			}

			return {
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
}

export default UsuarioRepository;
