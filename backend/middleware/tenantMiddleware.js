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
        // Handle Vercel deployments (e.g., lms-five-peach.vercel.app -> use default)
        // or Localhost
        if (host.includes('vercel.app') || host.includes('localhost')) {
            // For this demo, we can assume the Vercel app is the "main" tenant
            // OR we could check if there is a subdomain like "marketing.lms-five..." (custom domains)
            // But for now, let's treat the root vercel app as the default tenant.
            console.log("DEBUG: Vercel/Localhost detected, using fallback tenant.");
        } else {
            const parts = host.split('.');
            if (parts.length > 2) {
                subdomain = parts[0];
            }
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
