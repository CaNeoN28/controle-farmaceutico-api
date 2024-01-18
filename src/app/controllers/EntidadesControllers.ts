import { RequestHandler } from "express";
import Entidade, { FiltrosEntidade, IEntidade } from "../../types/Entidade";
import createEntidadeService from "../services/create.entidade.service";
import findEntidadeService from "../services/find.entidade.service";
import listEntidadesService from "../services/list.entidades.service";
import { PaginacaoQuery } from "../../types/Paginacao";
import updateEntidadeService from "../services/update.entidade.service";
import deleteEntidadeService from "../services/delete.entidade.service";

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
		const { estado, municipio, nome_entidade, ativo }: FiltrosEntidade =
			req.query;
		const { limite, pagina }: PaginacaoQuery = req.query;

		try {
			const resposta = await listEntidadesService({
				ativo,
				estado,
				municipio,
				nome_entidade,
				limite,
				pagina,
			});

			return res.status(200).send(resposta);
		} catch (err) {
			next(err);
		}
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
		const id = req.params.id;
		const { estado, municipio, nome_entidade, ativo } = req.body;

		try {
			const resposta = await updateEntidadeService(id, {
				estado,
				municipio,
				nome_entidade,
				ativo,
			});

			return res.status(200).send(resposta)
		} catch (error) {
			next(error);
		}
	};

	static RemoverEntidade: RequestHandler = async function (req, res, next) {
		const {id} = req.params

		try {
			await deleteEntidadeService(id)

			res.status(204).send()
		} catch (error) {
			next (error)
		}
	};
}
export default EntidadesControllers;
