import Erro from "../../types/Erro";
import { PaginacaoQuery } from "../../types/Paginacao";

function extrairPaginacao(params: any) {
	const { limite, pagina } = params as PaginacaoQuery;
	let erro: Erro | undefined = undefined;

	if (limite && isNaN(Number(limite))) {
		erro = {
			codigo: 400,
			erro: {
				limite: "Limite inválido",
			},
		};
	}

	if (pagina && isNaN(Number(pagina))) {
		erro = {
			codigo: erro?.codigo || 400,
			erro: {
				...erro?.erro,
				pagina: "Pagina inválida",
			},
		};
	}

	if (erro) throw erro;

	return {
		limite: Number(limite),
		pagina: Number(pagina),
	};
}

function calcularPaginas(documentos_totais: number, limite: number) {
	const resto = documentos_totais % limite;
	let paginas = Math.floor(documentos_totais / limite);

	if (resto != 0) paginas += 1;

	return paginas;
}

export { extrairPaginacao, calcularPaginas };
