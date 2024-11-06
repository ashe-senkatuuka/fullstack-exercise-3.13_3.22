const express = require('express')
const app = express()

app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/info', (request, response) => {
    const time = new Date();
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${time.toString()}</p>
        `);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)


    if (person) {
        response.json(person)
    } else {
        response.status(404).json({
            status: "Error",
            message: "Person not found"
        })
    }
})

const generateId = () => {
    const id = Math.random() * 10000000000
    return String(Math.ceil(id))
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = persons.find(person => person.name === body.name)
    // console.log(name);

    if (!body.number || !body.name) {
        return response.status(400).json({
            error: 'number or name missing'
        });
    } else if (name) {
        return response.status(400).json({
            error: 'name alredy exists'
        });
    }


    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons.push(person)

    response.status(202).json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    console.log('Deleting person');

    response.status(202).json({
        status: "Success",
        message: "Person deleted successfully"
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});