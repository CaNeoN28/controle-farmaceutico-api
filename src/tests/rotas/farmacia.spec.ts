import limparBanco from "../../app/utils/db/limparBanco";

beforeAll(async () => {});

afterAll(async () => {
	limparBanco();
});
