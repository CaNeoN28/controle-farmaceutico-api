import { RequestHandler } from "express";
import Entidade from "../../types/Entidade";
import createEntidadeService from "../services/create.entidade.service";
import findEntidadeService from "../services/find.entidade.service";

class EntidadesControllers {
	static EncontrarEntidadePorId: RequestHandler = async function (
		req,
		res,
		next
	) {
		const id = req.params.id as string;

		try {
			const entidade = await findEntidadeService(id);
			
			return res.status(200).send(entidade);
		} catch (error) {
			next(error);
		}
	};

	static ListarEntidades: RequestHandler = async function (req, res, next) {
		res.send("Listar entidades");
	};

	static CriarEntidade: RequestHandler = async function (req, res, next) {
		const { estado, municipio, nome_entidade }: Entidade = req.body;

		const data = {
			estado,
			municipio,
			nome_entidade,
		};

		try {
			const entidade = await createEntidadeService(data);

			return res.status(201).send(entidade);
		} catch (error: any) {
			next(error);
		}
	};

	static AtualizarEntidade: RequestHandler = async function (req, res, next) {
		res.send("Atualizer entidade");
	};

	static RemoverEntidade: RequestHandler = async function (req, res, next) {
		res.send("Remover entidade");
	};
}
export default EntidadesControllers;
