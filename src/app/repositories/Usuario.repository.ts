import Erro from "../../types/Erro";
import Usuario from "../../types/Usuario";
import UsuarioModel from "../models/Usuario";
import mongoose from "mongoose";

class UsuarioRepository {
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
