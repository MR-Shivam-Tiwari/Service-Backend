const express = require('express')
const router = express.Router();
const Department = require("../../Model/CollectionSchema/DepartmentSchema")

async function getDepartment(req, res, next) {
    try {

        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department Not Found' })

        }
        res.department = department;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

async function checkDuplicateDepart(req, res, next) {
    const { name } = req.body;
    try {
        const existingDepartment = await Department.findOne({ name });
        if (existingDepartment) {
            return res.status(400).json({ message: 'Department with the Same Name already Exists' })
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

}

router.post('/depart', checkDuplicateDepart, async (req, res) => {
    try {
        const newDepartment = new Department(req.body);
        const savedDepart = await newDepartment.save();
        res.status(201).json(savedDepart);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


router.get('/depart', async (req, res) => {
    try {
        const department = await Department.find();
        res.json(department)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});


router.get('/depart/:id', getDepartment, (req, res) => {
    res.json(res.department);
})


router.patch('/depart/:id', getDepartment, async (req, res) => {
    if (req.body.name != null) {
        res.department.name = req.body.name;
    }

    if (req.body.status != null) {
        res.department.status = req.body.status;
    }
    res.department.modifiedAt = Date.now();
    try {
        const updateDepartment = await res.department.save();
        res.json(updateDepartment)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})

router.delete('/depart/:id', async (req, res) => {
    try {
        const deletedDepartment = await Department.deleteOne({ _id: req.params.id })
        if (deletedDepartment.deletedCount === 0) {
            return res.status(404).json({ message: "Department Not Found" })
        }
        res.json({ message: 'Deleted Department' });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



module.exports = router;