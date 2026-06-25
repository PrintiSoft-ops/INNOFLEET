const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, vehicleController.getAll);
router.get('/:id', auth, vehicleController.getOne);
router.post('/', auth, admin, vehicleController.create);
router.put('/:id', auth, admin, vehicleController.update);
router.delete('/:id', auth, admin, vehicleController.delete);

module.exports = router;