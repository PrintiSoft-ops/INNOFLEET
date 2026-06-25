const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, admin, userController.getAll);
router.post('/', auth, admin, userController.create);
router.put('/:id', auth, admin, userController.update);
router.delete('/:id', auth, admin, userController.delete);

module.exports = router;