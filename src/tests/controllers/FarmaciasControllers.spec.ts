import { Request, Response, NextFunction } from "express";
import FarmaciaControllers from "../../app/controllers/FarmaciasControllers";
import createFarmaciaService from "../../app/services/create.farmacia.service";
import findFarmaciaService from "../../app/services/find.farmacia.service";
import listFarmaciasService from "../../app/services/list.farmacias.service";
import updateFarmaciaService from "../../app/services/update.farmacia.service";
import deleteFarmaciaService from "../../app/services/delete.farmacia.service";
import findNearestFarmaciaService from "../../app/services/find.proxima.farmacia.service";
import listPorEscalaFarmaciaService from "../../app/services/list.escala.farmacia.service";

jest.mock("../../app/services/create.farmacia.service");
jest.mock("../../app/services/find.farmacia.service");
jest.mock("../../app/services/list.farmacias.service");
jest.mock("../../app/services/update.farmacia.service");
jest.mock("../../app/services/delete.farmacia.service");
jest.mock("../../app/services/find.proxima.farmacia.service");
jest.mock("../../app/services/list.escala.farmacia.service");

describe("FarmaciaControllers - Encontrar Farmácia Por Id", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(createFarmaciaService as jest.Mock).mockReset();
	});

	it("deve encontrar farmácia por id e retornar 200", async () => {
		req.params.id = "farmacia123";
		const resposta = { nome_fantasia: "Farmacia" };
		(findFarmaciaService as jest.Mock).mockResolvedValue(resposta);

		await FarmaciaControllers.EncontrarFarmaciaPorId(
			req as Request,
			res as Response,
			next,
		);

		expect(findFarmaciaService).toHaveBeenCalledWith("farmacia123");
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando encontrar farmácia falha", async () => {
		(findFarmaciaService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await FarmaciaControllers.EncontrarFarmaciaPorId(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("FarmaciaControllers - Listar Farmácias", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(listFarmaciasService as jest.Mock).mockReset();
	});

	it("deve listar farmácias e retornar 200", async () => {
		req.query = { estado: "SP", municipio: "Sao Paulo" };
		const resposta = { itens: [] };
		(listFarmaciasService as jest.Mock).mockResolvedValue(resposta);

		await FarmaciaControllers.ListarFarmacias(
			req as Request,
			res as Response,
			next,
		);

		expect(listFarmaciasService).toHaveBeenCalledWith(req.query);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando listar farmácias falha", async () => {
		(listFarmaciasService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await FarmaciaControllers.ListarFarmacias(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("FarmaciaControllers - Criar Farmácia", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { body: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(createFarmaciaService as jest.Mock).mockReset();
	});

	it("deve criar farmácia e retornar 201", async () => {
		req.body = {
			cnpj: "12345678000100",
			nome_fantasia: "Farmacia Teste",
			endereco: {
				cep: "01001000",
				estado: "SP",
				municipio: "Sao Paulo",
				bairro: "Centro",
				logradouro: "Rua Teste",
				numero: "123",
				localizacao: { x: "0", y: "0" },
			},
		};
		const resposta = { id: "farmacia123" };
		(createFarmaciaService as jest.Mock).mockResolvedValue(resposta);

		await FarmaciaControllers.CriarFarmacia(
			req as Request,
			res as Response,
			next,
		);

		expect(createFarmaciaService).toHaveBeenCalledWith({
			cnpj: "12345678000100",
			nome_fantasia: "Farmacia Teste",
			endereco: req.body.endereco,
			horarios_servico: undefined,
			imagem_url: undefined,
			plantoes: undefined,
		});
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando criar farmácia falha", async () => {
		(createFarmaciaService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await FarmaciaControllers.CriarFarmacia(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("FarmaciaControllers - Atualizar Farmácia", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {}, body: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(updateFarmaciaService as jest.Mock).mockReset();
	});

	it("deve atualizar farmácia e retornar 200", async () => {
		req.params.id = "farmacia123";
		req.body = { nome_fantasia: "Atualizada" };
		const resposta = { id: "farmacia123" };
		(updateFarmaciaService as jest.Mock).mockResolvedValue(resposta);

		await FarmaciaControllers.AtualizarFarmacia(
			req as Request,
			res as Response,
			next,
		);

		expect(updateFarmaciaService).toHaveBeenCalledWith("farmacia123", req.body);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando atualizar farmácia falha", async () => {
		(updateFarmaciaService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await FarmaciaControllers.AtualizarFarmacia(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("FarmaciaControllers - Remover Farmácia", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(deleteFarmaciaService as jest.Mock).mockReset();
	});

	it("deve remover farmácia e retornar 204", async () => {
		req.params.id = "farmacia123";
		(deleteFarmaciaService as jest.Mock).mockResolvedValue(undefined);

		await FarmaciaControllers.RemoverFarmacia(
			req as Request,
			res as Response,
			next,
		);

		expect(deleteFarmaciaService).toHaveBeenCalledWith("farmacia123");
		expect(res.status).toHaveBeenCalledWith(204);
		expect(res.send).toHaveBeenCalledWith();
	});

	it("deve chamar next quando remover farmácia falha", async () => {
		(deleteFarmaciaService as jest.Mock).mockRejectedValue(new Error("Falha"));

		await FarmaciaControllers.RemoverFarmacia(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("FarmaciaControllers - Encontrar Próxima Farmácia", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(findNearestFarmaciaService as jest.Mock).mockReset();
	});

	it("deve encontrar farmácias próximas e retornar 200", async () => {
		req.query = {
			municipio: "Sao Paulo",
			estado: "SP",
			latitude: "-23",
			longitude: "-46",
			tempo: "24",
			pagina: 1,
			limite: 10,
		};
		const resposta = { itens: [] };
		(findNearestFarmaciaService as jest.Mock).mockResolvedValue(resposta);

		await FarmaciaControllers.EncontrarFarmaciasProximas(
			req as Request,
			res as Response,
			next,
		);

		expect(findNearestFarmaciaService).toHaveBeenCalledWith({
			municipio: "Sao Paulo",
			estado: "SP",
			latitude: "-23",
			longitude: "-46",
			tempo: "24",
			pagina: 1,
			limite: 10,
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando encontrar farmácias próximas falha", async () => {
		(findNearestFarmaciaService as jest.Mock).mockRejectedValue(
			new Error("Falha"),
		);

		await FarmaciaControllers.EncontrarFarmaciasProximas(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});

describe("FarmaciaControllers - Listar por Escala", () => {
	let req: any;
	let res: any;
	let next: NextFunction;

	beforeEach(() => {
		req = { params: {}, query: {} };
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
		};
		next = jest.fn();

		(listPorEscalaFarmaciaService as jest.Mock).mockReset();
	});

	it("deve listar farmácias por plantão e retornar 200", async () => {
		req.query = {
			municipio: "Sao Paulo",
			estado: "SP",
			tempo: "24",
			pagina: 1,
			limite: 10,
		};
		const resposta = { itens: [] };
		(listPorEscalaFarmaciaService as jest.Mock).mockResolvedValue(resposta);

		await FarmaciaControllers.ListarFarmaciaPorPlantao(
			req as Request,
			res as Response,
			next,
		);

		expect(listPorEscalaFarmaciaService).toHaveBeenCalledWith({
			municipio: "Sao Paulo",
			estado: "SP",
			tempo: "24",
			pagina: 1,
			limite: 10,
		});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(resposta);
	});

	it("deve chamar next quando listar farmácias por plantão falha", async () => {
		(listPorEscalaFarmaciaService as jest.Mock).mockRejectedValue(
			new Error("Falha"),
		);

		await FarmaciaControllers.ListarFarmaciaPorPlantao(
			req as Request,
			res as Response,
			next,
		);

		expect(next).toHaveBeenCalledWith(new Error("Falha"));
	});
});
