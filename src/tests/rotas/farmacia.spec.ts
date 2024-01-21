import { criarUsuarioAdm } from "../../app/utils/db/gerarDadosDiversos";
import limparBanco from "../../app/utils/db/limparBanco";
import { generateTokenFromUser } from "../../app/utils/jwt";
import Farmacia from "../../types/Farmacia";

let tokenAdm = "";

const farmacia = new Farmacia({
	cnpj: "49487534000183",
	endereco: {
		bairro: "Bairro estrela",
		cep: "00000000",
		estado: "Rondônia",
		municipio: "Vilhena",
		localizacao: {
			x: "0.0",
			y: "0.0",
		},
		logradouro: "Rua sol",
		numero: "1000",
	},
	nome_fantasia: "Farmácia das Galáxias",
	horarios_servico: [
		{
			dia_semana: "Segunda-feira",
			horario_entrada: "07:00",
			horario_saida: "15:00",
		},
	],
	plantoes: ["10/10/2024", "20/10/2024", "30/10/2024"],
});

beforeAll(async () => {
	const adm = (await criarUsuarioAdm()).usuario

	tokenAdm = generateTokenFromUser(adm)!
});

afterAll(async () => {
	limparBanco();
});
