
const Category = require("../model").category
const controller = {
  async getAllCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async getCategoryById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ msg: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async createCategory(req, res) {
    try {
      const { abbr, name, isActive } = req.body;
      const category = await Category.create({ abbr, name, isActive });
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async updateCategoryById(req, res) {
    try {
      const { abbr, name, isActive } = req.body;
      let category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ msg: 'Category not found' });
      }
      category.abbr = abbr;
      category.name = name;
      category.isActive = isActive;
      await category.save();
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async deleteCategoryById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ msg: 'Category not found' });
      }
      await category.destroy();
      res.json({ msg: 'Category deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
};

module.exports = controller;

