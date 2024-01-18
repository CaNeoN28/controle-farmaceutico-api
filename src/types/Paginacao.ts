interface Paginacao {
	limite: number;
	pagina: number;
}

interface PaginacaoQuery {
	limite?: string;
	pagina?: string;
}

export { Paginacao, PaginacaoQuery };
