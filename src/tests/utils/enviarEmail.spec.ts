import enviarEmail from "../../app/utils/enviarEmail";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

jest.mock("nodemailer");
jest.mock("dotenv");

describe("enviarEmail", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve enviar email com sucesso", async () => {
		const mockTransporter = {
			use: jest.fn(),
			sendMail: jest.fn().mockResolvedValue(true),
		};

		(nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
		(dotenv.config as jest.Mock).mockImplementation(() => {});

		process.env.SMTP_SERVER = "smtp.test.com";
		process.env.API_EMAIL = "test@test.com";
		process.env.API_PASS = "password";

		const params = {
			para: "destinatario@test.com",
			assunto: "Teste",
			template: "recoveryEmail" as const,
			contexto: {
				recoveryLink: "http://test.com/recover",
				usuario: "Test User",
				appLogoUrl: "http://test.com/logo.png",
			},
		};

		await enviarEmail(params);

		expect(nodemailer.createTransport).toHaveBeenCalledWith({
			host: "smtp.test.com",
			port: 587,
			auth: {
				user: "test@test.com",
				pass: "password",
			},
		});

		expect(mockTransporter.use).toHaveBeenCalled();
		expect(mockTransporter.sendMail).toHaveBeenCalledWith({
			to: "destinatario@test.com",
			subject: "Teste",
			context: params.contexto,
			template: "recoveryEmail",
		});
	});

	it("deve enviar email sem template", async () => {
		const mockTransporter = {
			use: jest.fn(),
			sendMail: jest.fn().mockResolvedValue(true),
		};

		(nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
		(dotenv.config as jest.Mock).mockImplementation(() => {});

		process.env.SMTP_SERVER = "smtp.test.com";
		process.env.API_EMAIL = "test@test.com";
		process.env.API_PASS = "password";

		const params = {
			para: "destinatario@test.com",
			assunto: "Teste",
			texto: "Texto do email",
		};

		await enviarEmail(params);

		expect(mockTransporter.sendMail).toHaveBeenCalledWith({
			to: "destinatario@test.com",
			subject: "Teste",
			context: undefined,
			template: undefined,
		});
	});

	it("deve propagar erro do nodemailer", async () => {
		const mockTransporter = {
			use: jest.fn(),
			sendMail: jest.fn().mockRejectedValue(new Error("SMTP Error")),
		};

		(nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
		(dotenv.config as jest.Mock).mockImplementation(() => {});

		process.env.SMTP_SERVER = "smtp.test.com";
		process.env.API_EMAIL = "test@test.com";
		process.env.API_PASS = "password";

		const params = {
			para: "destinatario@test.com",
			assunto: "Teste",
			template: "recoveryEmail" as const,
			contexto: {
				recoveryLink: "http://test.com/recover",
				usuario: "Test User",
				appLogoUrl: "http://test.com/logo.png",
			},
		};

		await expect(enviarEmail(params)).rejects.toThrow("SMTP Error");
	});
});
