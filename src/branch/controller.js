const Branch = require("../model").branch
const branchController = {
  // Get all branches
  async getAll(req, res) {
    try {
      const branches = await Branch.findAll();
      res.status(200).json(branches);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a specific branch by ID
  async getById(req, res) {
    const { id } = req.params;
    try {
      const branch = await Branch.findByPk(id);
      if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      res.status(200).json(branch);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new branch
  async create(req, res) {
    const { branchCode, name, description, isActive, salePercentage, winPercentage } = req.body;
    try {
      const newBranch = await Branch.create({
        branchCode,
        name,
        description,
        isActive, salePercentage, winPercentage
      });
      res.status(200).json(newBranch);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Update an existing branch by ID
  async update(req, res) {
    const { id } = req.params;
    const { branchCode, name, description, isActive, salePercentage, winPercentage } = req.body;
    try {
      const updatedBranch = await Branch.update(
        {
          branchCode,
          name,
          description,
          isActive, salePercentage, winPercentage
        },
        { where: { id } }
      );
      if (updatedBranch[0] === 0) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      res.status(200).json({ message: 'Branch updated successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a branch by ID
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedBranch = await Branch.destroy({ where: { id } });
      if (!deletedBranch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
      res.status(200).json({ message: 'Branch deleted successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = branchController;
