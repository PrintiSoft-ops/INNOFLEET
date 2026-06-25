const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, maintenanceController.getAll);
router.post('/', auth, maintenanceController.create);
router.put('/:id', auth, maintenanceController.update);
router.delete('/:id', auth, admin, maintenanceController.delete);

module.exports = router;