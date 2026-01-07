const Tenant = require('../models/Tenant');

/**
 * Middleware to identify and attach the tenant to the request object.
 * Identification methods:
 * 1. X-Tenant-Id header (useful for testing/API)
 * 2. Origin/Subdomain (production)
 */
const tenantHandler = async (req, res, next) => {
    let tenantId = req.headers['x-tenant-id'];
    let subdomain = req.headers['x-tenant-subdomain'];

    // If no header, try to extract from hostname (e.g., org1.lms.com)
    if (!tenantId && !subdomain) {
        const host = req.get('host');
        const parts = host.split('.');
        if (parts.length > 2) {
            subdomain = parts[0];
        }
    }

    console.log("DEBUG: Tenant Middleware - Incoming", {
        host: req.get('host'),
        subdomainHeader: req.headers['x-tenant-subdomain'],
        tenantIdHeader: req.headers['x-tenant-id']
    });

    try {
        let tenant;
        if (tenantId) {
            tenant = await Tenant.findById(tenantId);
        } else if (subdomain) {
            tenant = await Tenant.findOne({ subdomain: subdomain.toLowerCase() });
        }

        if (tenant) {
            // FORCE Rebrand for the demo
            tenant.name = 'HaxoAcademy';
            console.log("DEBUG: Tenant Middleware - FOUND", { name: tenant.name, id: tenant._id });
        } else {
            console.log("DEBUG: Tenant Middleware - NOT FOUND", { subdomain, tenantId });
            // FALLBACK: For development on localhost, if no tenant found, pick the first one
            // This ensures things "just work" for the user's demo
            tenant = await Tenant.findOne({});
            if (tenant) {
                tenant.name = 'HaxoAcademy';
                console.log("DEBUG: Tenant Middleware - FALLBACK to first tenant", { name: tenant.name });
            }
        }

        req.tenant = tenant;
        next();
    } catch (error) {
        console.error('Tenant Middleware Error:', error);
        res.status(500).json({ message: 'Error resolving tenant' });
    }
};

module.exports = { tenantHandler };
