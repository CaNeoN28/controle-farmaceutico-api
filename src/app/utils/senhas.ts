import bcrypt from "bcrypt"

async function criptografarSenha(senha: string){
	const salt = await bcrypt.genSalt(6)
	const hash = await bcrypt.hash(senha, salt)

	return hash
}

export {
	criptografarSenha
}