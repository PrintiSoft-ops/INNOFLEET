const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuelController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, fuelController.getAll);
router.post('/', auth, fuelController.create);
router.put('/:id', auth, fuelController.update);
router.delete('/:id', auth, admin, fuelController.delete);

module.exports = router;