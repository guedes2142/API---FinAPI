


# API Bancária Simples

Uma API bancária simples desenvolvida em Node.js utilizando o framework Express.

## Rotas

### `POST /account`

Cria uma nova conta bancária.

Parâmetros de entrada (JSON):json
```markdown
{
  "cpf": "123.456.789-00",
  "name": "Nome do Cliente"
}
```

### `GET /statement`

Obtém o extrato bancário do cliente.

### `POST /deposit`

Realiza um depósito na conta do cliente.

Parâmetros de entrada (JSON):
```json
{
  "description": "Descrição do depósito",
  "amount": 100.00
}
```

### `POST /withdraw`

Realiza um saque na conta do cliente.

Parâmetros de entrada (JSON):
```json
{
  "amount": 50.00
}
```

### `GET /statement/date`

Obtém o extrato bancário do cliente com base em uma data específica.

Parâmetros de consulta (query string):
```
date: Data no formato "YYYY-MM-DD"
```

### `PUT /account`

Atualiza o nome da conta do cliente.

Parâmetros de entrada (JSON):
```json
{
  "name": "Novo Nome do Cliente"
}
```

### `GET /account`

Obtém informações da conta do cliente.

### `DELETE /account`

Exclui a conta do cliente.

### `GET /balance`

Obtém o saldo da conta do cliente.

## Middleware

A API utiliza um middleware para verificar a existência da conta do cliente com base no CPF fornecido nos cabeçalhos das requisições.

## Como Rodar

1. Clone este repositório.
2. Instale as dependências com o comando `npm install`.
3. Execute o servidor com o comando `npm start`.
4. Acesse a API através de `http://localhost:3333`.

## Tecnologias Utilizadas

- Node.js
- Express
- UUID



