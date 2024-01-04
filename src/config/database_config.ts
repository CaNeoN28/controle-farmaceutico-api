import { connect } from "mongoose";

const URL = "mongodb://localhost:27017";

async function ConnectDB() {
  await connect(URL)
    .then(() => console.log("Conexão com o banco de dados realizada!"))
    .catch((error) =>
      console.log(`Não foi possível conectar com o banco de dados: ${error}`)
    );
}

export default ConnectDB;
