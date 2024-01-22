import { RequestHandler } from "express";
import Farmacia from "../../types/Farmacia";
import createFarmaciaService from "../services/create.farmacia.service";
import findFarmaciaService from "../services/find.farmacia.service";

class FarmaciaControllers {
	static EncontrarFarmaciaPorId: RequestHandler = async function (
		req,
		res,
		next
	) {
		const { id } = req.params;

		try {
			const resposta = await findFarmaciaService(id);

			res.status(200).send(resposta);
		} catch (error) {
			next(error);
		}
	};

	static ListarFarmacias: RequestHandler = async function (req, res, next) {
		res.send("Listar farmácia");
	};

	static CriarFarmacia: RequestHandler = async function (req, res, next) {
		const {
			cnpj,
			endereco,
			nome_fantasia,
			horarios_servico,
			imagem_url,
			plantoes,
		} = req.body as Farmacia;

		try {
			const resposta = await createFarmaciaService({
				cnpj,
				endereco,
				nome_fantasia,
				horarios_servico,
				imagem_url,
				plantoes,
			});

			res.status(201).send(resposta);
		} catch (error) {
			next(error);
		}
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
