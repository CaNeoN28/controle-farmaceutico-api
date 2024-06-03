import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import hbs from "nodemailer-express-handlebars";

async function enviarEmail({
	para,
	assunto,
	template,
	contexto,
}: {
	para: string;
	assunto: string;
	texto?: string;
	html?: string;
	template?: "recoveryEmail";
	contexto?: {
		recoveryLink: string;
		usuario: string;
		appLogoUrl: string;
	};
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
	}) as hbs.HbsTransporter;

	transporter.use(
		"compile",
		hbs({
			viewEngine: {
				extname: ".handlebars",
				partialsDir: "./src/templates/",
				layoutsDir: "./src/templates/",
				defaultLayout: "recoveryEmail",
			},
			viewPath: "./src/templates/",
			extName: ".handlebars",
		})
	);

	await transporter.sendMail({
		to: para,
		subject: assunto,
		context: contexto,
		template,
	});
}

export default enviarEmail;
