const Tenant = require('../models/Tenant');

// @desc    Register a new tenant
// @route   POST /api/tenants
// @access  Public (or Admin only in prod)
const registerTenant = async (req, res) => {
    const { name, subdomain, branding } = req.body;

    try {
        const tenantExists = await Tenant.findOne({ subdomain });
        if (tenantExists) {
            return res.status(400).json({ message: 'Subdomain already taken' });
        }

        const tenant = await Tenant.create({
            name,
            subdomain,
            branding
        });

        res.status(201).json(tenant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tenant details (Public branding info)
// @route   GET /api/tenants/current
// @access  Public
const getCurrentTenant = async (req, res) => {
    if (!req.tenant) {
        return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(req.tenant);
};

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private/Admin
const getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.find({});
        res.json(tenants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a tenant
// @route   DELETE /api/tenants/:id
// @access  Private/Admin
const deleteTenant = async (req, res) => {
    try {
        await Tenant.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tenant deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerTenant,
    getCurrentTenant,
    getAllTenants,
    deleteTenant
};
