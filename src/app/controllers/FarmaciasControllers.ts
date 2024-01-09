import { RequestHandler } from "express";

class FarmaciaControllers {
	static EncontrarFarmaciaPorId: RequestHandler = async function (
		req,
		res,
		next
	) {
		res.send("Encontrar farmácia por ID");
	};

	static ListarFarmacias: RequestHandler = async function (req, res, next) {
		res.send("Listar farmácia");
	};

	static CriarFarmacia: RequestHandler = async function (req, res, next) {
		res.send("Cadastrar Farmácia");
	};

	static AtualizarFarmacia: RequestHandler = async function (req, res, next) {
		res.send("Atualizar Farmácia");
	};

	static RemoverFarmacia: RequestHandler = async function (req, res, next) {
		res.send("Remover farmácia");
	};

	static EncontrarFarmaciaProxima: RequestHandler = async function (
		req,
		res,
		next
	) {
		res.send("Encontrar farmácia próxima");
	};

	static ListarFarmaciaPorPlantao: RequestHandler = async function (
		req,
		res,
		next
	) {
		res.send("Listar farmácias por plantão");
	};
}

export default FarmaciaControllers;
