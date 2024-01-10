import mongoose from "mongoose";
import UsuarioModel from "../models/Usuario";

async function criarUsuarioAdm (){
	const usuario = new UsuarioModel({
		cpf: "27170296055",
		dados_administrativos: {
			funcao: "ADMINISTRADOR",
			entidade_relacionada: new mongoose.Types.ObjectId()
		},
		email: "administrador@email.com",
		imagem_url: ".jpg",
		nome_completo: "Administrador",
		nome_usuario: "administrador",
		numero_registro: "0",
		senha: "12345678Asdf."
	})

	await usuario.save()
}

export default criarUsuarioAdm