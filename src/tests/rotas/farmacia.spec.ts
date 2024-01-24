import mongoose from "mongoose";
import app from "../../app/app";
import { criarUsuarioAdm } from "../../app/utils/db/gerarDadosDiversos";
import limparBanco from "../../app/utils/db/limparBanco";
import { generateTokenFromUser } from "../../app/utils/jwt";
import Farmacia from "../../types/Farmacia";
import request from "supertest";

let tokenAdm = "";
let idFarmacia = "";

const date = new Date();

const plantoes = [
	[date.getFullYear(), date.getMonth() + 1, date.getDate()].join("/"),
	[date.getFullYear() + 1, date.getMonth() + 1, date.getDate()].join("/"),
];

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
	horarios_servico: {
		segunda_feira: {
			horario_entrada: "07:00",
			horario_saida: "16:00",
		},
	},
	plantoes,
	imagem_url: ".jpg",
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

		const id = resposta._id;

		expect(id).toBeDefined;
		expect(resposta).toMatchObject(dadosFarmacia);

		idFarmacia = id;
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
			"endereco.numero": "Número é obrigatório",
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
				horarios_servico: {
					segunda_feira: {
						horario_entrada: "24:00",
						horario_saida: "00:00",
					},
				},
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
			"endereco.numero": "Número inválido",
			nome_fantasia: "Nome fantasia inválido",
			"horarios_servico.segunda_feira.horario_entrada":
				"Horário de entrada inválido",
			"horarios_servico.segunda_feira.horario_saida":
				"Horário de saída inválido",
		});
	});

	it("deve retornar erro ao tentar cadastrar uma farmácia sem estar autenticado", async () => {
		const resposta = await request(app)
			.post("/farmacia")
			.set("Accept", "application/json")
			.send(dadosFarmacia)
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("É necessário estar autenticado para usar esta rota");
	});
});

describe("A rota de recuperação de farmácia", () => {
	it("deve retornar uma farmácia cadastrada pelo ID", async () => {
		const resposta = await request(app)
			.get(`/farmacia/${idFarmacia}`)
			.set("Accept", "application/json")
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatchObject(dadosFarmacia);
	});

	it("deve retornar erro por um ID inexistente", async () => {
		const idFalso = new mongoose.Types.ObjectId();
		const resposta = await request(app)
			.get(`/farmacia/${idFalso}`)
			.set("Accept", "application/json")
			.expect(404)
			.then((res) => res.text);

		expect(resposta).toBe("Farmácia não encontrada");
	});

	it("deve retornar erro por um ID inválido", async () => {
		const resposta = await request(app)
			.get("/farmacia/idinvalido")
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Id inválido");
	});
});

describe("A rota de listagem de farmácias", () => {
	it("deve retornar uma lista com os dados cadastrados anteriormente", async () => {
		const resposta = await request(app)
			.get("/farmacias")
			.set("Accept", "application/json")
			.expect(200)
			.then((res) => res.body);
		const dados = resposta.dados;

		expect(dados).toBeDefined();
		expect(dados[0]).toMatchObject({
			...dadosFarmacia,
			_id: idFarmacia,
		});
		expect(resposta).toMatchObject({
			pagina: 1,
			limite: 10,
			paginas_totais: 1,
			documentos_totais: 1,
		});
	});

	it("deve aceitar filtros para listagem", async () => {
		const resposta = await request(app)
			.get("/farmacias")
			.query("nome_fantasia=Farmácia inexistente")
			.query("bairro=Bairro inexistente")
			.query("estado=Estado inexistente")
			.query("municipio=Municipio inexistente")
			.set("Accept", "application/json")
			.expect(200)
			.then((res) => res.body);
		const dados = resposta.dados;

		expect(dados).toBeDefined();
		expect(dados[0]).toBeUndefined();
		expect(resposta).toMatchObject({
			pagina: 1,
			limite: 10,
			paginas_totais: 0,
			documentos_totais: 0,
		});
	});

	it("deve aceitar dados de paginação", async () => {
		const resposta = await request(app)
			.get("/farmacias")
			.query("pagina=2")
			.query("limite=2")
			.set("Accept", "application/json")
			.expect(200)
			.then((res) => res.body);
		const dados = resposta.dados;

		expect(dados).toBeDefined();
		expect(dados[0]).toBeUndefined();
		expect(resposta).toMatchObject({
			pagina: 2,
			limite: 2,
			paginas_totais: 1,
			documentos_totais: 1,
		});
	});
});

describe("A rota de atualização de farmácia", () => {
	it("deve atualizar os dados da farmácia cadastrada anteriormente", async () => {
		const resposta = await request(app)
			.put(`/farmacia/${idFarmacia}`)
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.send({
				nome_fantasia: "Farmácia Via Láctea",
			})
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			...dadosFarmacia,
			nome_fantasia: "Farmácia Via Láctea",
		});
	});

	it("deve realizar validação dos dados de atualização", async () => {
		const resposta = await request(app)
			.put(`/farmacia/${idFarmacia}`)
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.send({
				cnpj: "000000",
			})
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			cnpj: "CNPJ inválido",
		});
	});

	it("deve retornar erro no caso de ID inexistente", async () => {
		const idFalso = new mongoose.Types.ObjectId();
		const resposta = await request(app)
			.put(`/farmacia/${idFalso}`)
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.send({})
			.expect(404)
			.then((res) => res.text);

		expect(resposta).toBe("Farmácia não encontrada");
	});

	it("deve retornar erro no caso do ID ser inválido", async () => {
		const resposta = await request(app)
			.put("/farmacia/idinvalido")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.send({})
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Id inválido");
	});

	it("deve retornar erro se não for informado o token de autenticação", async () => {
		const resposta = await request(app)
			.put(`/farmacia/${idFarmacia}`)
			.set("Accept", "application/json")
			.send({})
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("É necessário estar autenticado para usar esta rota");
	});
});

describe("A rota de recuperação de farmácia próxima", () => {
	it("Deve retornar a farmácia cadastrada anteriormente", async () => {
		const resposta = await request(app)
			.get("/farmacia/proxima")
			.query("latitude=0")
			.query("longitude=0")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toMatchObject({
			...dadosFarmacia,
			nome_fantasia: "Farmácia Via Láctea",
		});
	});

	it("Deve retornar erro ao informar dados de localização inválidos", async () => {
		const resposta = await request(app)
			.get("/farmacia/proxima")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Latitude e longitude são obrigatórios");
	});

	it("Deve retornar erro ao informar dados de localização inválidos", async () => {
		const resposta = await request(app)
			.get("/farmacia/proxima")
			.query("latitude=0")
			.query("longitude=0")
			.query("tempo=tempoinvalida")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Tempo inválido");
	});

	it("Deve retornar erro ao informar dados de localização inválidos", async () => {
		const resposta = await request(app)
			.get("/farmacia/proxima")
			.query("latitude=invalida")
			.query("longitude=invalida")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.body);

		expect(resposta).toEqual({
			latitude: "Latitude inválida",
			longitude: "Longitude inválida",
		});
	});

	it("Deve retornar erro ao procurar por uma farmácia que não esta aberta", async () => {
		const resposta = await request(app)
			.get("/farmacia/proxima")
			.query("latitude=0")
			.query("longitude=0")
			.query(`tempo=${new Date("1999/10/10")}`)
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.expect(404)
			.then((res) => res.text);

		expect(resposta).toBe("Não há farmácias abertas próximas");
	});
});

describe("A rota de listagem de farmácias por plantão", () => {
	it("deve retorar uma lista com um dia de plantão e a farmácia cadastrado anteriormente", async () => {
		const resposta = await request(app)
			.get("/farmacias/plantao")
			.query("estado=Rondônia")
			.query("municipio=Vilhena")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.expect(200)
			.then((res) => res.body);

		expect(resposta).toHaveProperty(dadosFarmacia.plantoes![0]);
	});

	it("deve retornar erro com tempo inválido", async () => {
		const resposta = await request(app)
			.get("/farmacias/plantao")
			.query("tempo=tempoinvalido")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Tempo informado inválido");
	});
});

describe("A rota de remoção de farmácia", () => {
	it("deve retornar erro no caso do ID ser inexistente", async () => {
		const idFalso = new mongoose.Types.ObjectId();
		const resposta = await request(app)
			.delete(`/farmacia/${idFalso}`)
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.expect(404)
			.then((res) => res.text);

		expect(resposta).toBe("Farmácia não encontrada");
	});

	it("deve retornar erro no caso do ID ser inexistente", async () => {
		const resposta = await request(app)
			.delete("/farmacia/idinvalido")
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.expect(400)
			.then((res) => res.text);

		expect(resposta).toBe("Id inválido");
	});

	it("deve retornar erro se não for informado o token de autenticação", async () => {
		const resposta = await request(app)
			.delete(`/farmacia/${idFarmacia}`)
			.set("Accept", "application/json")
			.expect(401)
			.then((res) => res.text);

		expect(resposta).toBe("É necessário estar autenticado para usar esta rota");
	});

	it("deve remover a farmácia cadastrada anteriormente", async () => {
		const resposta = await request(app)
			.delete(`/farmacia/${idFarmacia}`)
			.set("Authorization", `Bearer ${tokenAdm}`)
			.set("Accept", "application/json")
			.expect(204)
			.then((res) => res.body);

		expect(resposta).toEqual({});
	});
});
