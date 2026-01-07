const express = require('express');
const router = express.Router();
const { registerTenant, getCurrentTenant, getAllTenants, deleteTenant } = require('../controllers/tenantController');
const { protect, admin } = require('../middleware/authMiddleware');
const { tenantHandler } = require('../middleware/tenantMiddleware');

router.route('/')
    .get(protect, admin, getAllTenants)
    .post(registerTenant);

router.get('/current', tenantHandler, getCurrentTenant);
router.delete('/:id', protect, admin, deleteTenant);

module.exports = router;
