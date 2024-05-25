# Plataforma de Controle de Plantão Farmacêutico 

Bem vindo ao repositório de desenvolvimento da API da Plataforma de Controle de Plantão Farmacêutico. Este projeto visa disponibilizar uma plataforma onde seja possível cadastrar e visualizar farmácias, seus horários de serviço e suas escalas de plantão, além de mostrar ao usuário qual a farmácia mais próxima dele.

Isto se trata da segunda parte de um sistema que envolve uma API e uma Aplicação Web (A Aplicação Web pode ser encontrada [aqui](https://github.com/CaNeoN28/controle-farmaceutico-frontend)).

## Como executar a API?

### Execução do banco de dados:

O primeiro passo para a execução da API é permitir que o Docker (disponível no [site da aplicação](https://www.docker.com)) crie um container com um banco de dados do MongoDB. Para isso é necessário montar e executar a imagem do banco. Para a montagem execute comando:
```
docker build -f Dockerfile.db.api . -t controle-db
```

Então para a execução do container, é necessário definir configurações para determinar a rede do container, escolher a porta de execução e manter o container executando, o que pode ser feito utilizando o comando:
```
docker run -p 27017:27017 --name controle-db --network controle --restart unless-stopped controle-db 
```

### Configuração das variáveis de ambiente:
Também é necessário a configuração de um arquivo .env na pasta do projeto. O arquivo contém varíaveis importantes para a execução do projeto, como o endereço do banco de dados, chave privada para criptografia, a porta de execução é configurações para o serviço de email. O seguinte conteúdo será usado neste arquivo:

```
DB_URL = Endereço do banco de dados
FRONTEND_URL = Endereço do site da plataforma
SECRET_KEY = Chave privada para criptografia
PORT = Porta da aplicação

SMTP_SERVER = Endereço do servidor SMTP
API_EMAIL =	Endereço do email SMTP
API_PASS = Senha do email SMTP
```

O endereço do site é utilizado na geração de emails de recuperação de senha. O serviço SMTP utilizado durante os testes foi o [ETHEREAL](https://ethereal.email), mas é possível utilizar outro servidor. A porta pode ser qualquer uma, mas foi utilizada a porta 3030 durante o ambiente de testes.

### 1ª Opção - Execução como desenvolvedor:

Para executar a API como um desenvolvedor, é necessário realizar a instalação de dependências e executar a aplicação por meio do [NodeJS](https://nodejs.org/en). A instalação de dependências é feita pelo comando:

```
npm install
```

Após a instalação, basta executar a aplicação com o comando:

```
npm run dev
```

Após isso, a API estará disponível pelo endereço http://localhost:3030, se a porta selecionada for a 3030.

### 2ª Opção - Montagem e execução do container da API:

Para executar a aplicação usando um container do [Docker](https://www.docker.com), que executa com o mínimo de recursos para o funcionamento, é necessário montar uma imagem e executá-la com algumas configurações. Para montar a imagem com o nome controle-api é necessário executar o seguinte comando:

```
docker build -f Dockerfile.api -t controle-api
```

Com a imagem montada, basta executar o container, utilizando configurações para mantê-lo de pé, escolher a porta de execução, e definir a rede do docker. Para isto, use a seguinte linha de comando:

```
docker run -d -p 3030:3030 --name controle-api --network controle --restart unless-stopped controle-api
```

Depois disso, a API também estará disponível pelo endereço http://localhost:3030.