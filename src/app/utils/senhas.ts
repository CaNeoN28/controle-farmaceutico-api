import bcrypt from "bcrypt";

async function criptografarSenha(senha: string) {
	const salt = await bcrypt.genSalt(6);
	const hash = await bcrypt.hash(senha, salt);

	return hash;
}

async function compararSenha(senha: string, hash: string) {
	return await bcrypt
		.compare(senha, hash)
		.then(() => true)
		.catch(() => false);
}

export { criptografarSenha, compararSenha };
