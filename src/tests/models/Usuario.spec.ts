import mongoose from "mongoose";
import Usuario from "../../app/models/Usuario";

const dadosUsuario = {
	_id: new mongoose.Types.ObjectId(),
	cpf: "23841067085",
	dados_administrativos: {
		entidade_relacionada: new mongoose.Types.ObjectId(),
		funcao: "ADMINISTRADOR"
	},
	email: "antoniobandeira@email.com",
	imagem_url: ".jpg",
	nome_completo: "Antonio Bandeira",
	nome_usuario: "antonio_bandeira",
	numero_registro: "0000000000",
	senha: "12345678Asdf",
};

describe("O modelo de usuário", () => {
	it("deve cadastrar um usuário com os dados informados", () => {
		const usuario = new Usuario(dadosUsuario);

		expect(usuario).toMatchObject(dadosUsuario)
	});
});
