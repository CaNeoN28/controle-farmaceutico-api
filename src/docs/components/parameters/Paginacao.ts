import {Parameter} from "swagger-jsdoc";

const Pagina: Parameter = {
	name: "pagina",
	description: "Número da página de exibição",
	example: 1,
	in: "query",
	schema: {
		type: "number",
	}
}

const Limite: Parameter = {
	name: "limite",
	description: "Número limite de documentos",
	example: 10,
	in: "query",
	schema: {
		type: "number",
	}
}

export {Pagina, Limite}