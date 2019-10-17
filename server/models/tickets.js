const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

let ticketSchema = new Schema({
    user: {
        type: String,
        trim: true,
        required: [true, 'El usuario es necesario']
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'La categoria es necesaria']
    },
    priority: {
        type: String,
        trim: true,
        required: [true, 'El nivel de prioridad es necesario']
    },
    deadlineDate: { //FALTA CONTROLAR QUE SEA UNA FECHA
        type: Object,
    },
    parentTicket: { //FALTA CONTROLAR QUE SEA UN TICKET
        type: Object,
    },
    status: {
        type: String,
        trim: true,
        required: [true, 'El estado es necesario']
    },
    assignedSpecialist: { //FALTA CONTROLAR QUE SEA UN ESPECIALISTA
        type: Object,
        required: [true, 'El especialista asignado es necesario']
    },
    state: {
        type: Boolean,
        default: true
    }
})

ticketSchema.methods.toJSON = () => {

    let ticket = this;

    let ticketJSON = {
        user: ticket.user,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        deadlineDate: ticket.deadlineDate,
        parentTicket: ticket.parentTicket,
        status: ticket.status,
        assignedSpecialist: ticket.assignedSpecialist,
        state: ticket.state,
    }

    return ticketJSON;
}

ticketSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Ticket', ticketSchema);