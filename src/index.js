const express = require('express');
const { v4: uuidv4 } = require('uuid')

const app = express();

app.use(express.json());        
customers = [];

/** Middleware */
function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;
    const customer = customers.find((customer) => customer.cpf === cpf);
    if(!customer) {
        return response.status(400).json({Error: 'Customer not found!'});
    }

    request.customer = customer; /** usamos o  próprio request para repassar  a informações que estamos consumindo em nosso
    middleware para as demais rotas exemplo const customer onde queremos verificar se a tal cpf esta em nosso banco de dados
    para retorna essas informações podemos chamar nosso customer em forma de desestruturação  - { customer } assim podemos
    retornar por exemplo customer.<um objeto da lista ou do banco de dados relacionado a esse cpf>
    */

    return next();
}
/** End Middleware 
 * Temos duas formas de usar o middleware umas passando dentro da nossa rota e a outra através do app.use()
 * Usamos o app.use(verifyIfExistsAccountCPF) quando queremos que tudo abaixo dele seja usado
 * Usamos na rota quando queremos que apenas partes de nossa aplicação use o middleware
 */

//**Start getBalance */
function getBalance(statement) {
    /** Usamos a função reduce() do javascript que será responsável por calcular aquilo que entra e sai
     *  essa função recebe dois parâmetros acc, operation , sendo acc a responsável por acumular os valores
     *  e o operation o objeto que vamos iterar
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
     */
    const balance = statement.reduce((acc, operation) => {
        if(operation.type === 'Credit') {
            return acc + operation.amount;
        }else{
            return acc - operation.amount; 
        }
    }, 0) /** aqui no final passamos um último parâmetro, em qual valor iniciaremos o reduce que é 0 o valor inicial
    que iremos trabalhar  */
    return balance;
}
//**End getBalance */

app.post('/account', (request, response) => {
    const { cpf , name} = request.body;
    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);
    if(customerAlreadyExists) {
        return response.status(400).json({Error: 'Customer already exists!'});
    }
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send();

});

app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;  /** Aqui passamos só o request porque já estamos chamando o headers através do middleware */
  

    return response.json(customer.statement);

});


//** start deposit */
app.post('/deposit', verifyIfExistsAccountCPF, (request , response ) => {
    const { description ,amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'Credit'
    }

    customer.statement.push(statementOperation);

    return response.json(customer.statement);
    
});
//** End deposit */

//** start Withdraw */
app.post('/withdraw', verifyIfExistsAccountCPF, (request, response) =>{
    const { amount } = request.body;
    const { customer } =request;

    const balance = getBalance(customer.statement);

    if(balance < amount) {
        return response.status(400).json({Error: 'insufficient funds'});
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: 'Debit'
    }

    customer.statement.push(statementOperation);

    return response.status(201).send()

});
//** End Withdraw */

app.get('/statement/date', verifyIfExistsAccountCPF, (request ,response) =>{
    const { customer } = request;
    const { date } = request.query;
    const dateFormate = new Date(date + ' 00:00');
    const filteredStatement = customer.statement.filter((statement) => statement.created_at.toDateString() 
    === new Date(dateFormate).toDateString());

    return response.json(filteredStatement);
    
});

app.put('/account', verifyIfExistsAccountCPF, (request, response) => {
    const { name } = request.body;
    const {customer} = request;

    customer.name = name;

    return response.status(201).send();
});

app.get('/account', verifyIfExistsAccountCPF, (request, response) =>{
    const { customer } = request;

    return response.json(customer);
});

app.delete('/account', verifyIfExistsAccountCPF, (request, response)=>{
    const { customer } =request;
    //** Para deletar usarei a função splice do javascript ela recebe dois parâmetros o primeiro ele iniciar no próprio objeto*/
    //** o segundo é a partir de qual posição ele ira remover! */
    customers.splice(customer, 1);

    return response.status(200).json(customers);
});

app.get('/balance', verifyIfExistsAccountCPF, (request, response) =>{
    const { customer }= request;
    const balance = getBalance(customer.statement)
    return response.json(balance);
})

app.listen(3333, () => {console.log("Server is running on port 3333");});
