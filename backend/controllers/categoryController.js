const { validationResult } = require('express-validator');
const categoryModel = require('../models/categoryModel');

const listCategories = async (req, res) => {
  const categories = await categoryModel.listCategoriesByUser(req.user.id);
  res.json(categories);
};

const createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const category = await categoryModel.createCategory(req.user.id, req.body.name);
  return res.status(201).json(category);
};

module.exports = { listCategories, createCategory };
