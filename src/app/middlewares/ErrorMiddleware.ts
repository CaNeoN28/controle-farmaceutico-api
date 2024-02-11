import { ErrorRequestHandler } from "express";
import Erro from "../../types/Erro";

const ErrorMiddleware: ErrorRequestHandler = async function (err: Erro, req, res, next) {
	try {
		const {codigo, erro} = err

		res.status(codigo).send(erro)
	} catch (error){
		console.log(error)
		
		res.status(500).send("Erro interno do servidor")
	}
}

export default ErrorMiddleware