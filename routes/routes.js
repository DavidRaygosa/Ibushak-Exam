'use strict'

// IMPORTS
const express = require('express');

// Controllers
const MLAPI = require('../controllers/mlapi_controller');

// Routes
const router = express.Router();

	// Mercado Libre API
		router.get('/mlapi/:page', MLAPI.getByPage); // Get 50 articles filtered per page
		router.get('/mlapi', MLAPI.getAll); // Get all list (DEFAULT 1000)

module.exports = router;