import { RequestHandler } from "express";
import Farmacia from "../../types/Farmacia";
import createFarmaciaService from "../services/create.farmacia.service";
import findFarmaciaService from "../services/find.farmacia.service";
import listFarmaciasService from "../services/list.farmacias.service";
import updateFarmaciaService from "../services/update.farmacia.service";
import deleteFarmaciaService from "../services/delete.farmacia.service";
import findNearestFarmaciaService from "../services/find.proxima.farmacia.service";
import listPorEscalaFarmaciaService from "../services/list.escala.farmacia.service";

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
		const params = req.query;

		try {
			const resposta = await listFarmaciasService(params);

			res.status(200).send(resposta);
		} catch (error) {
			next(error);
		}
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
		const { id } = req.params;
		const {
			cnpj,
			endereco,
			horarios_servico,
			nome_fantasia,
			imagem_url,
			plantoes,
		}: Farmacia = req.body;

		try {
			const resposta = await updateFarmaciaService(id, {
				cnpj,
				endereco,
				horarios_servico,
				nome_fantasia,
				imagem_url,
				plantoes,
			});

			res.status(200).send(resposta);
		} catch (error) {
			next(error);
		}
	};

	static RemoverFarmacia: RequestHandler = async function (req, res, next) {
		const { id } = req.params;

		try {
			await deleteFarmaciaService(id);

			res.status(204).send();
		} catch (error) {
			next(error);
		}
	};

	static EncontrarFarmaciaProxima: RequestHandler = async function (
		req,
		res,
		next
	) {
		const { municipio, estado, longitude, latitude, tempo, pagina, limite } =
			req.query as any;

		try {
			const resposta = await findNearestFarmaciaService({
				municipio,
				estado,
				latitude,
				longitude,
				tempo,
				pagina,
				limite,
			});

			res.status(200).send(resposta);
		} catch (error) {
			next(error);
		}
	};

	static ListarFarmaciaPorPlantao: RequestHandler = async function (
		req,
		res,
		next
	) {
		const { municipio, estado, tempo } = req.query as any;

		try {
			const plantoes = await listPorEscalaFarmaciaService({
				municipio,
				estado,
				tempo,
			});

			res.status(200).send(plantoes);
		} catch (error) {
			next(error);
		}
	};
}

export default FarmaciaControllers;
