import UsuarioModel from "../app/models/Usuario";
import faker from "faker-br";
import { Funcao } from "../types/Usuario";
import { criptografarSenha } from "../app/utils/senhas";
import { erroParaDicionario } from "../app/utils/mongooseErrors";

export default async function usuarioSeed(
	instancias: number,
	idsEntidades: string[]
) {
	await UsuarioModel.deleteMany()

	const funcoes: Funcao[] = ["ADMINISTRADOR", "GERENTE", "INATIVO", "USUARIO"];
	const idsUsuarios: string[] = [];

	for (let i = 0; i < instancias; i++) {
		const entidade_relacionada =
			idsEntidades[Math.floor(Math.random() * idsEntidades.length)];

		const { firstName, lastName } = {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
		};

		const Usuario = new UsuarioModel({
			cpf: faker.br.cpf(),
			dados_administrativos: {
				entidade_relacionada,
				funcao: funcoes[Math.floor(Math.random() * funcoes.length)],
			},
			email: `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(
				Math.random() * 100
			)}@gmail.com`,
			imagem_url: ".jpg",
			nome_completo: `${firstName} ${lastName}`,
			nome_usuario: `${lastName}${Math.floor(Math.random() * 100)}`,
			numero_registro: Math.floor(Math.random() * 100000),
			senha: await criptografarSenha("12345678Asdf"),
		});

		try {
			await Usuario.save();
			idsUsuarios.push(Usuario.id);
		} catch (e) {
		}
	}

	return idsUsuarios;
}
