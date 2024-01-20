interface IPermissoes {
	[key: string]: number
}

const PERMISSOES: IPermissoes = {
	ADMINISTRADOR: 3,
	GERENTE: 2,
	USUARIO: 1,
	INATIVO: 0,
};

export default PERMISSOES;
