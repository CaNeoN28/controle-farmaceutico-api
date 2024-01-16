import mongoose from "mongoose";
import UsuarioModel from "../../models/Usuario";

async function criarUsuarioAdm() {
	const usuario = new UsuarioModel({
		cpf: "27170296055",
		dados_administrativos: {
			funcao: "ADMINISTRADOR",
			entidade_relacionada: new mongoose.Types.ObjectId(),
		},
		email: "administrador@email.com",
		imagem_url: ".jpg",
		nome_completo: "Administrador",
		nome_usuario: "administrador",
		numero_registro: "0",
		senha: "12345678Asdf.",
	});

	await usuario.save();

	return {
		dadosLogin: {
			usuario: usuario.nome_usuario,
			senha: usuario.senha,
		},
		usuario: usuario.toObject(),
	};
}

async function criarUsuarioInativo() {
	const usuario = new UsuarioModel({
		cpf: "00790914077",
		dados_administrativos: {
			entidade_relacionada: new mongoose.Types.ObjectId(),
		},
		email: "usuarioinativo@gmail.com",
		imagem_url: ".jpg",
		nome_completo: "Usuário Inativo",
		nome_usuario: "usuarioinativo",
		numero_registro: "1",
		senha: "12345678Asdf.",
	});

	await usuario.save();

	return {
		usuario: usuario.nome_usuario,
		senha: usuario.senha,
	};
}

async function encontrarPorId(id: string) {
	return await UsuarioModel.findById(id)
		.then((res) => {
			return res;
		})
		.catch((err) => {
			return err;
		});
}

async function criarUsuario(data: any) {
	const usuario = await UsuarioModel.create(data);

	return usuario;
}

export { criarUsuarioAdm, criarUsuarioInativo, encontrarPorId, criarUsuario };
