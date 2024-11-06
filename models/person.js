const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'Name must be at least 3 characters long'],
        required: [true, 'Name is required'],
        trim: true
    },
    number: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                // Validate phone number format
                return /^\d{2,3}-\d{5,}$/.test(v) && v.length >= 8;
            },
            message: props => `${props.value} is not a valid phone number! Format should be XX-XXXXX or XXX-XXXXX with total length of at least 8 digits`
        }
    }
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', personSchema)