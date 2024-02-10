# Plataforma de Controle de Plantão Farmacêutico 

Bem vindo ao projeto da API da plataforma de controle farmacêutico, cujo objetivo principal é permitir o cadastro e exibição de plantões, mostrando ao usuário qual a farmácia aberta mais próxima.

## Como executar a API?

### Build e execução do container
Primeiramente é necessário a criação e execução de um container docker com o banco de dados. Para isso use os seguintes comandos no terminal:

Para o build da imagem:
```
docker build -f Dockerfile.db.api . -t controle-farmaceutico-db
```

Para execução do container:
```
docker run -p 27017:27017 controle-farmaceutico-db 
```

### Execução da API
Será necessário a criação de um arquivo .env (variáveis de ambiente) para configurar a API. O seguinte conteúdo será necessário:

```
DB_URL = mongodb://localhost:27017
SECRET_KEY = dAQVusR39m2EzfNHpxAux15TYJUmVTs9
PORT = 3030

SMTP_SERVER = smtp.ethereal.email
API_EMAIL =	gillian28@ethereal.email
API_PASS = hF3XHtumF6esaWyHnq
```

O email utilizado é um email do Ethereal para propósitos de teste envio de email, podendo ser substituído.

Depois da criação do arquivo, basta executar o comando:
```
npm run dev
```

Após isso a api estará executando no endereço http://localhost:3030/