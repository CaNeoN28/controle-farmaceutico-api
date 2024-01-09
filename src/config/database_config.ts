import { connect } from "mongoose";

async function ConnectDB(url: string) {
  await connect(url)
    .then(() => console.log("Conexão com o banco de dados realizada!"))
    .catch((error) =>
      console.log(`Não foi possível conectar com o banco de dados: ${error}`)
    );
}

export default ConnectDB;
