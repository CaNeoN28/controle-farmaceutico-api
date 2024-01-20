function validarCEP(cep: string) {
	cep = cep.replace(/\s+|-/g, "");

	if (isNaN(Number(cep))) return false;

	const regex = /^\d{8}$/;

	return regex.test(cep);
}

export default validarCEP;
