const express = require('express');
const router = express.Router();

const InvoicesController = require('../controllers/invoices');

router.get('/', InvoicesController.invoices_get_all);

router.post('/', InvoicesController.invoices_create_invoice);

router.get('/unapproved/', InvoicesController.invoices_get_unapproved_invoice);

router.post('/approved/', InvoicesController.invoices_get_approved_invoice);

module.exports = router;

