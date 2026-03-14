const express = require('express');
const router = express.Router();
const { getAllUsers, updateUser, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// Protect all admin routes
router.use(protect, admin);

router.route('/users').get(getAllUsers);
router.route('/users/:id').put(updateUser).delete(deleteUser);

module.exports = router;
