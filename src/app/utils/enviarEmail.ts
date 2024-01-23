import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

async function enviarEmail({
	para,
	assunto,
	texto,
	html,
}: {
	para: string;
	assunto: string;
	texto?: string;
	html?: string;
}) {
	dotenv.config();
	const { SMTP_SERVER, API_EMAIL, API_PASS } = process.env;

	const transporter = nodemailer.createTransport({
		host: SMTP_SERVER,
		port: 587,
		auth: {
			user: API_EMAIL,
			pass: API_PASS,
		},
	});

	await transporter.sendMail({
		to: para,
		subject: assunto,
		text: texto,
		html: html,
	});
}

export default enviarEmail;
