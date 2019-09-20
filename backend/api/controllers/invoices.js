const mongoose = require('mongoose');
const Invoice = require('../models/invoice');

exports.invoices_get_all = (req,res,next) => {
    Invoice.find()
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.invoices_create_invoice = (req,res,next) => {
    const invoice = new Invoice({
        _id: new mongoose.Types.ObjectId(),
        invoice_number: req.body.invoice_number,
        total: req.body.total,
        currency: req.body.currency,
        invoice_date: req.body.invoice_date,
        due_date: req.body.due_date,
        vendor_name: req.body.vendor_name,
        remittance_address: req.body.remittance_address,
        status: 'Pending'
    })
    invoice.save().then(result => {
        console.log(result);
        res.status(200).json({message: 'invoice submitted successfully'});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.invoices_get_unapproved_invoice = (req,res,next) => {
    Invoice.find({ status: 'Pending' })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.invoices_get_approved_invoice = (req,res,next) => {
    let idList = [];
    for (const ops of req.body) {
        idList.push(ops._id);
    }
    Invoice.updateMany(
        { _id: { $in: idList } },
        { $set: { "status" : 'Approved' } }
    )        
    .then(result => {
        console.log(result);
        res.status(200).json({message: 'invoices approved successfully'});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}
