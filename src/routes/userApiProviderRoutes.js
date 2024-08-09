const express = require('express');
const {
  createUserApiProvider,
  createNewUserApiProvider, // Import the new controller function
  getUserApiProvider,
  updateUserApiProvider,
  deleteUserApiProvider,
  getAllUserApiProviders,
  getUserApiProvidersByUserId,
  deleteUserApiProviderByProviderId // Import the new delete function
} = require('../controllers/userApiProviderController');

const router = express.Router();

router.post('/user-api-providers', createUserApiProvider);
router.post('/user-api-providers/provider/new', createNewUserApiProvider); // Add this route
router.get('/user-api-providers/:id', getUserApiProvider);
router.put('/user-api-providers/:id', updateUserApiProvider);
router.delete('/user-api-providers/:id', deleteUserApiProvider);
router.delete('/user-api-providers/provider/delete/:id', deleteUserApiProviderByProviderId); // Add this route
router.get('/user-api-providers', getAllUserApiProviders);
router.get('/user-api-providers/user/:userId', getUserApiProvidersByUserId);

module.exports = router;
