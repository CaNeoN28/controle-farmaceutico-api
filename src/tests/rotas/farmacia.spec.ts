import app from "../../app/app";
import { criarUsuarioAdm } from "../../app/utils/db/gerarDadosDiversos";
import limparBanco from "../../app/utils/db/limparBanco";
import { generateTokenFromUser } from "../../app/utils/jwt";
import Farmacia from "../../types/Farmacia";
import request from "supertest";

let tokenAdm = "";

const dadosFarmacia = new Farmacia({
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
	const adm = (await criarUsuarioAdm()).usuario;

	tokenAdm = generateTokenFromUser(adm)!;
});

afterAll(async () => {
	limparBanco();
});

describe("A rota de cadastro de farmácias", () => {
	it("deve cadastrar uma farmácia corretamente e retornar os dados cadastrados", async () => {
		const resposta = await request(app)
			.post("/farmacia")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.send(dadosFarmacia)
			.expect(201)
			.then((res) => res.body);

		expect(resposta).toMatchObject(dadosFarmacia);
	});

	it("deve retornar erro de dados obrigatórios ao informar um documento vazio", async () => {
		const resposta = await request(app)
			.post("/farmacia")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.send({})
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			cnpj: "CNPJ é obrigatório",
			"endereco.bairro": "Bairro é obrigatório",
			"endereco.cep": "CEP é obrigatório",
			"endereco.estado": "Estado é obrigatório",
			"endereco.municipio": "Município é obrigatório",
			"endereco.localizacao": "Localização é obrigatório",
			"endereco.logradouro": "Logradouro é obrigatório",
			"endereco.numero": "Numero é obrigatório",
			nome_fantasia: "Nome fantasia é obrigatório",
		});
	});

	it("deve retornar erro ao tentar cadastrar dados inválidos", async () => {
		const resposta = await request(app)
			.post("/farmacia")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.send({
				cnpj: "00000000000000",
				endereco: {
					bairro: "BI",
					cep: "CEPINVÁLIDO",
					estado: "EI",
					municipio: "MI",
					localizacao: {
						x: "LATITUDE",
						y: "LONGITUDE",
					},
					logradouro: "LI",
					numero: "Número inválido",
				},
				nome_fantasia: "NI",
				horarios_servico: [
					{
						dia_semana: "Dia inválido",
						horario_entrada: "15:30",
						horario_saida: "12:00",
					},
				],
			} as Farmacia)
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			cnpj: "CNPJ inválido",
			"endereco.bairro": "Bairro inválido",
			"endereco.cep": "CEP inválido",
			"endereco.estado": "Estado inválido",
			"endereco.municipio": "Município inválido",
			"endereco.localizacao.x": "Latitude inválida",
			"endereco.localizacao.y": "Longitude inválida",
			"endereco.logradouro": "Logradouro inválido",
			"endereco.numero": "Numero inválido",
			nome_fantasia: "Nome fantasia inválido",
			"horarios_servico.0.dia_semana": "Dia da semana inválido",
			"horarios_servico.0.horario_entrada": "Horário de entrada inválido",
			"horarios_servico.0.horario_saida": "Horário de saída inválido",
		});
	});

	it("deve retornar erro ao tentar cadastrar uma farmácia sem estar autenticado", async () => {
		const resposta = await request(app)
			.post("/farmacia")
			.set("Accept", "application/json")
			.send(dadosFarmacia)
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toMatchObject(
			"É necessário estar autenticado para usar esta rota"
		);
	});
});
