// src/routes/userApiProviderRoutes.js
const express = require('express');
const {
  createUserApiProvider,
  getUserApiProvider,
  updateUserApiProvider,
  deleteUserApiProvider,
  getAllUserApiProviders
} = require('../controllers/userApiProviderController');

const router = express.Router();

router.post('/user-api-providers', createUserApiProvider);
router.get('/user-api-providers/:id', getUserApiProvider);
router.put('/user-api-providers/:id', updateUserApiProvider);
router.delete('/user-api-providers/:id', deleteUserApiProvider);
router.get('/user-api-providers', getAllUserApiProviders); // Ensure this route is defined

module.exports = router;
