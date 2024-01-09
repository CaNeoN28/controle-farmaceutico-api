import { RequestHandler } from "express";

class EntidadesControllers {
	static EncontrarEntidadePorId: RequestHandler = async function (req, res, next) {
		res.send("Recuperar entidade por Id")
	}

	static ListarEntidades: RequestHandler = async function (req, res, next) {
		res.send("Listar entidades")
	}

	static CriarEntidade: RequestHandler = async function (req, res, next) {
		res.send("Criar entidade")
	}

	static AtualizarEntidade: RequestHandler = async function (req, res, next) {
		res.send("Atualizer entidade")
	}

	static RemoverEntidade: RequestHandler = async function (req, res, next) {
		res.send("Remover entidade")
	}
}
export default EntidadesControllers;
