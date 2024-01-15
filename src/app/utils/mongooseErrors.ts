function erroParaDicionario(tabela: string, erro: any) {
	const mensagemErro = erro.message as string;
	const errosValidacao = erro.errors;

	const erros: any = {};
	let codigo = 500;

	if (mensagemErro && mensagemErro.includes(`${tabela} validation failed`)) {
		codigo = 400;
		Object.keys(errosValidacao).map((k) => {
			erros[k] = errosValidacao[k].message;
		});
	}

	return { erros, codigo };
}

export { erroParaDicionario };
