const express = require('express');
const router = express.Router();
const UserType = require('../../Model/CollectionSchema/UserTypeSchema');

// Middleware function to get a state by ID
async function getUserType(req, res, next) {
    try {
        const usertype = await UserType.findById(req.params.id);
        if (!usertype) {
            return res.status(404).json({ message: 'usertype not found' });
        }
        res.usertype = usertype; // Attach state object to response
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Middleware function to check duplicate state by name and country
async function checkDuplicateUserType(req, res, next) {
    const { name, roles } = req.body;
    try {
        const existingUserType = await UserType.findOne({ name, roles });
        if (existingUserType) {
            return res.status(400).json({ message: 'UserType with the same name and country already exists' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Create a new state
router.post('/usertype', checkDuplicateUserType, async (req, res) => {
    try {
        const newUserType = new UserType(req.body);
        const savedUserType = await newUserType.save();
        res.status(201).json(savedUserType);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all states
router.get('/usertype', async (req, res) => {
    try {
        const states = await UserType.find();
        res.json(states); // Return all states
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single state
router.get('/usertype/:id', getUserType, (req, res) => {
    res.json(res.usertype); // Return single user type fetched by middleware
});

// Update a state
router.patch('/usertype/:id', getUserType, async (req, res) => {
    if (req.body.name != null) {
        res.usertype.name = req.body.name;
    }
    if (req.body.status != null) {
        res.usertype.status = req.body.status;
    }
    if (req.body.roles != null) {
        res.usertype.roles = req.body.roles;
    }
    res.usertype.modifiedAt = Date.now(); // Update modifiedAt field
    try {
        const updatedState = await res.usertype.save();
        res.json(updatedState);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Delete a state
router.delete('/usertype/:id', async (req, res) => {
    try {
        const deleteusertype = await UserType.deleteOne({ _id: req.params.id });
        if (deleteusertype.deletedCount === 0) {
            return res.status(404).json({ message: 'usertype not found' });
        }
        res.json({ message: 'Deleted usertype' }); // Return success message
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
