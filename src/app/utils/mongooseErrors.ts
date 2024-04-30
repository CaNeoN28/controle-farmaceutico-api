import { CastError } from "mongoose";

function erroParaDicionario(tabela: string, erro: any) {
	const mensagemErro = erro.message as string;
	const errosValidacao = erro.errors;

	const erros: any = {};
	let codigo = 500;

	if (mensagemErro && mensagemErro.match(new RegExp("validation failed", "i"))) {
		codigo = 400;
		Object.keys(errosValidacao).map((k) => {
			erros[k] = errosValidacao[k].message;
		});
	} else if (erro.name == "CastError"){
		const {path, message} = erro as CastError

		codigo = 400;
		erros[path] = message
	}

	return { erros, codigo };
}

export { erroParaDicionario };
