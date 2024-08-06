// src/routes/apiProviderRoutes.js
const express = require('express');
const router = express.Router();
const { getAllProviders, createProvider, getProviderById, updateProviderById, deleteProviderById } = require('../controllers/apiProviderController');

router.get('/providers', getAllProviders);
router.post('/providers', createProvider);
router.get('/providers/:id', getProviderById);
router.put('/providers/:id', updateProviderById);
router.delete('/providers/:id', deleteProviderById);

module.exports = router;
