const express = require('express')
const morgan = require('morgan');
const mongoose = require('mongoose')
require('dotenv').config()

const Person = require('./models/person')

const app = express()

app.use(express.json())

morgan.token('request-body', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(morgan('tiny')); //Morgan logging with tiny configuration
app.use(morgan(':request-body')); //Morgan logging with request body

const url = process.env.MONGODB_URI


mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })


app.get('/', (request, response) => {
    response.send('<h1>Full Stack Open Exercises</h1>');
});

//Get all persons
app.get('/api/persons', async (request, response) => {
    try {
        const persons = await Person.find({});
        response.status(200).json(persons);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching persons' });
    }

});

app.get('/api/info', (request, response) => {
    const time = new Date();
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${time.toString()}</p>
        `);
});

//Get single person
app.get('/api/persons/:id', async (request, response) => {
    try {
        const id = request.params.id;

        const person = await Person.findById(id);

        if (person) {
            response.status(200).json(person);
        } else {
            response.status(404).json({
                status: "Error",
                message: "Person not found"
            });
        }

    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({
            status: "Error",
            message: "Error retrieving person"
        });
    }
});

// Saving new numbers to database
app.post('/api/persons', async (request, response) => {
    try {
        const { name, number } = request.body;

        // Create new Person document
        const person = new Person({
            name,
            number
        });

        // Save to database
        const savedPerson = await person.save();
        response.status(201).json(savedPerson);

    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return response.status(400).json({ error: error.message });
        }
        response.status(500).json({ error: 'Error saving person' });
    }
})

//Update single number
app.put('/api/persons/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { name, number } = request.body;

        // Find and update the person
        const updatedPerson = await Person.findByIdAndUpdate(
            id,
            { name, number },
            { 
                new: true,  // Return updated document
                runValidators: true,  // Run schema validators on update
                context: 'query'  // Required for custom validators
            }
        );

        // If person wasn't found
        if (!updatedPerson) {
            return response.status(404).json({
                error: 'Person not found'
            });
        }

        response.json(updatedPerson);

    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return response.status(400).json({
                error: error.message
            });
        }

        console.error('Update error:', error);
        response.status(500).json({
            error: 'Error updating person'
        });
    }
});

//Delete a number from phonebook
app.delete('/api/persons/:id', async (request, response) => {
    try {
        const id = request.params.id;

        // Find and delete the person
        const deletedPerson = await Person.findByIdAndDelete(id);

        // If person wasn't found
        if (!deletedPerson) {
            return response.status(404).json({
                status: "Error",
                message: "Person not found"
            });
        }

        console.log('Deleting person:', deletedPerson.name);

        response.status(200).json({
            status: "Success",
            message: "Person deleted successfully",
            data: deletedPerson
        });

    } catch (error) {
        console.error('Delete error:', error);
        response.status(500).json({
            status: "Error",
            message: "Error deleting person",
            error: error.message
        });
    }
});
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})