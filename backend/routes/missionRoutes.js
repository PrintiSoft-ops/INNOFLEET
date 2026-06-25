const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, missionController.getAll);
router.post('/', auth, missionController.create);
router.put('/:id', auth, missionController.update);
router.delete('/:id', auth, admin, missionController.delete);

module.exports = router;