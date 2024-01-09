import Erro from "../../types/Erro";
import Usuario from "../../types/Usuario";
import UsuarioModel from "../models/Usuario";

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
				erro: "Email já cadastrado",
			};
		} else {
			try {
				await usuario.save();
			} catch (error) {}
		}

		return { usuario, erro };
	}
	static updateUsuario(id: string, data: any) {}
	static deleteUsuario(id: string) {}
}

export default UsuarioRepository;
