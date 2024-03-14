
const MaxSale = require("../model").maxSale;
const { body, validationResult } = require('express-validator');
const logger = require("../api/logger");
const controller = {
    async create(req, res) {
        let { branchId } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are validation errors, return a 400 Bad Request response with the errors
            return res.status(400).json({ errors: errors.array() });
        }
        const duplicateBranchCheck = await duplicateBranch(req.body.branchId);
        if (duplicateBranchCheck) {
            return res.status(404).json({ message: 'ສາຂານີ້ ໄດ້ຕັ້ງໄວ້ແລ້ວ' });
        }
        // ****** Set branch id to Main branch if client not include the fiels
        if (!branchId) {
            logger.error("No branch id")
            branchId = 1;
        }
        // return res.send(branchId);
        req.body.branchId = branchId;
        try {
            const maxsale = await MaxSale.create(req.body);
            res.status(200).json(maxsale);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Retrieve all MaxSale records
    async findAll(req, res) {
        try {
            const maxsales = await MaxSale.findAll({ include: 'branch' });
            res.status(200).json(maxsales);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Retrieve a single MaxSale record by ID
    async findOne(req, res) {
        const { id } = req.params;
        try {
            const maxsale = await MaxSale.findByPk(id, { include: 'branch' });
            if (!maxsale) throw new Error('MaxSale not found');
            res.status(200).json(maxsale);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    },

    // Update a MaxSale record by ID
    async update(req, res) {
        const { id } = req.params;
        try {
            const maxsale = await MaxSale.findByPk(id);
            if (!maxsale) throw new Error('MaxSale not found');
            await maxsale.update(req.body);
            res.status(200).json(maxsale);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }, async delete(req, res) {
        const { id } = req.params;
        try {
            const maxsale = await MaxSale.findByPk(id);
            if (!maxsale) throw new Error('MaxSale not found');
            await maxsale.destroy();
            res.status(204).end();
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }
}
const duplicateBranch = async (branchId) => {
    try {
        const maxSale = await MaxSale.findOne({ where: { branchId }, include: 'branch' });
        if (!maxSale) {
            return false;
        }
        return true
    } catch (err) {
        console.error(err);
        return false
    }
}
module.exports = controller;