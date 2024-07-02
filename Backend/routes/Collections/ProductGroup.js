const express = require('express')
const router = express.Router()
const ProductGroup = require("../../Model/CollectionSchema/ProductGroupSchema")


async function getProductGroup(req, res, next) {
    try {
        const productgroup = await ProductGroup.findById(req.params.id);
        if (!productgroup) {
            return res.status(404).json({ message: "ProductGroup Not Found" })
        }
        res.productgroup = productgroup
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

async function checkDuplicateProductGroup(req, res, next) {
    const { name, shortcode, ChlNo } = req.body;
    try {
        const existingproduct = await ProductGroup.findOne({ name, shortcode, ChlNo })
        if (existingproduct) {
            return res.status(404).json({ message: 'ProductGroup already exists' })
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

router.post('/productgroup', checkDuplicateProductGroup, async (req, res) => {
    try {
        const newProduct = new ProductGroup(req.body);
        const savedproduct = await newProduct.save();
        res.status(201).json(savedproduct)

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

router.get('/productgroup', async (req, res) => {
    try {
        const productgroup = await ProductGroup.find();
        res.status(200).json(productgroup)

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

router.get('/productgroup/:id', getProductGroup, (req, res) => {
    res.json(res.productgroup);
})


router.patch('/productgroup/:id', getProductGroup, async (req, res) => {
    if (req.body.name != null) {
        res.productgroup.name = req.body.name;
    }
    if (req.body.status != null) {
        res.productgroup.status = req.body.status;
    }
    if (req.body.shortcode != null) {
        res.productgroup.shortcode = req.body.shortcode;
    }
    if (req.body.ChlNo != null) {
        res.productgroup.ChlNo = req.body.ChlNo;
    }
    if (req.body.RevNo != null) {
        res.productgroup.RevNo = req.body.RevNo;
    }
    if (req.body.type != null) {
        res.productgroup.type = req.body.type;
    }
    res.productgroup.modifiedAt = Date.now();

    try {
        const updatedProductGroup = await res.productgroup.save();
        res.status(200).json(updatedProductGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/productgroup/:id', async (req, res) => {
    try {
        const deleteProduct = await ProductGroup.deleteOne({ _id: req.params.id });
        if (deleteProduct.deletedCount === 0) {
            return res.status(404).json({ message: 'ProductGroup Not Found' })
        }
        res.json({ message: 'Deleted ProductGroup' })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;