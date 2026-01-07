const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        if (!req.tenant) {
            return res.status(400).json({ message: 'Tenant context required' });
        }
        const users = await User.find({ tenant: req.tenant._id }).select('-password');
        console.log(`[Admin] Fetched ${users.length} users for tenant ${req.tenant._id}`);
        res.json(users);
    } catch (error) {
        console.error("[Admin] Error fetching users:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        if (!req.tenant) {
            return res.status(400).json({ message: 'Tenant context required' });
        }
        const user = await User.findOne({ _id: req.params.id, tenant: req.tenant._id });

        if (user) {
            if (user.role === 'admin') {
                console.log(`[Admin] Attempted to delete admin user with ID: ${req.params.id}`);
                res.status(400).json({ message: 'Cannot delete admin user' });
                return;
            }
            await user.deleteOne();
            console.log(`[Admin] User with ID: ${req.params.id} removed.`); // Added console log for successful deletion
            res.json({ message: 'User removed' });
        } else {
            console.log(`[Admin] User with ID: ${req.params.id} not found for deletion.`); // Added console log for user not found
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(`[Admin] Error deleting user with ID: ${req.params.id}:`, error); // Added console log for error
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get system statistics
// @route   GET /api/users/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        if (!req.tenant) {
            return res.status(400).json({ message: 'Tenant context required' });
        }
        const t = req.tenant._id;
        const userCount = await User.countDocuments({ tenant: t });
        const studentCount = await User.countDocuments({ role: 'student', tenant: t });
        const instructorCount = await User.countDocuments({ role: 'instructor', tenant: t });
        const courseCount = await Course.countDocuments({ tenant: t });
        const enrollmentCount = await Enrollment.countDocuments({
            course: { $in: await Course.find({ tenant: t }).distinct('_id') }
        });

        res.json({
            users: userCount,
            students: studentCount,
            instructors: instructorCount,
            courses: courseCount,
            enrollments: enrollmentCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users across all tenants
// @route   GET /api/users/admin/all
// @access  Private/Admin
const getAllUsersAcrossTenants = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    deleteUser,
    getStats,
    getAllUsersAcrossTenants
};
