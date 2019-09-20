const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    invoice_number: Number,
    total: Number,
    invoice_date: String,
    due_date: String,
    vendor_name: String,
    remittance_address: String,
    status: String
})

module.exports = mongoose.model('Invoice', invoiceSchema);