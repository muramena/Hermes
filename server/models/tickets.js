const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const validCategories = {
    values: [0, 1, 2, 3, 4, 5, 6, 7],
    message: '{VALUE} no es una categoría válida'
}
const validPriorities = {
    values: [0, 1, 2],
    message: '{VALUE} no es una prioridad permitida'
}
const validStatus = {
    values: [0, 1, 2, 3, 4, 5],
    message: '{VALUE} no es un estado válido'
}

const Schema = mongoose.Schema
/**
 * Creates ticket Schema
 * user
 * title
 * description
 * category
 * priority
 * deadlineDate
 * parentTicket
 * Status
 * assignedSpecialist
 * state
 */
let ticketSchema = new Schema({
    user: {
        type: String,
        trim: true,
        required: [true, 'El usuario es necesario']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'El titulo es necesario']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'La descripción es necesaria']
    },
    category: {
        type: Number,
        required: [true, 'La categoria es necesaria'],
        enum: validCategories
    },
    priority: {
        type: Number,
        enum: validPriorities
    },
    deadlineDate: {
        type: Date,
        default: undefined  //new Date(+new Date() + 7*24*60*60*1000)
    },
    parentTicket: {
        type: Object,
        default: undefined,
    },
    status: {
        type: Number,
        default: 0,
        enum: validStatus
    },
    assignedSpecialist: {
        type: String,
        trim: true,
        default: undefined
    },
    state: {
        type: Boolean,
        default: true
    }
})

ticketSchema.method.getCategory = function () {

    let ticket = this;
    switch (ticket.category){
        case 0:
            return 'Pedido de desarrollo'
        case 1:
            return 'Pedido de modificación'
        case 2:
            return 'Corrección de error'
        case 3:
            return 'Problema con internet'
        case 4:
            return 'Problema de red interna'
        case 5:
            return 'Problema de servicio'
        case 6:
            return 'Ayuda para operar sistema'
        case 7:
            return 'Ayuda para operar un hardware'
    }
    return 'Error';

}

ticketSchema.method.getPriority = function () {

    let ticket = this;
    switch (ticket.priority){
        case 0:
            return 'Baja'
        case 1:
            return 'Media'
        case 2:
            return 'Urgente'
    }
    return 'Error';

}

ticketSchema.method.getStatus = function () {

    let ticket = this;
    switch (ticket.category){
        case 0:
            return 'Sin asignar'
        case 1:
            return 'Por realizar'
        case 2:
            return 'En proceso'
        case 3:
            return 'Finalizado'
        case 4:
            return 'Cancelado'
        case 5:
            return 'En espera'
    }
    return 'Error';

}

ticketSchema.pre('findOneAndUpdate', async () => {

    console.log('CANCELANDO/ELIMINANDO')
    if (this._update.state === false){
        const cascade = await Ticket.updateMany({parentTicket: this._conditions._id}, { $set: { state: false } });
        console.log('Tickets eliminados: ' + cascade.nModified);
    } else {
        if (this._update.status === false){
            const cascade = await Room.updateMany({parentTicket: this._conditions._id}, { $set: { status: 4 } });
            console.log('Tickets cancelados: ' + cascade.nModified);
        }
    }
    console.log('FIN')
});

ticketSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Ticket', ticketSchema);