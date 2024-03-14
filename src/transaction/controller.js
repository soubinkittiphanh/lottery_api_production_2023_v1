
const Transaction = require('../model').transaction;
const logger = require('../api/logger');
const service = require('./service');


// Create a new Transaction
exports.create = async (req, res) => {
  const transactionList = req.body;
  try {
    const {validateTxnResult,transaction} = await service.verifyTransactionMax(transactionList)
    logger.info(`Over limit error length: ${validateTxnResult.length}`)
    if(validateTxnResult.length>0) {
      logger.error(`Transaction fail due to transaction sale over limit amount`)
      return res.status(400).send(validateTxnResult)
    }
    const dbTransaction = await Transaction.bulkCreate(transaction);
    logger.info(`Transaction completed: ${dbTransaction.length} \n ${dbTransaction.toString()}`)
    res.status(200).json(dbTransaction);
  } catch (err) {
    logger.error(`Something went wrong ${err}`)
    res.status(400).json({ message: err.message });
  }
};

// Retrieve all Transactions
exports.findAll = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Retrieve all Transactions by userId
exports.findAllByUserId = async (req, res) => {
  const { userId,scheduleId } = req.body;
  try {
    const transactions = await Transaction.findAll({where:{
      userId,scheduleId
    }});
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Retrieve a single Transaction by id
exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) throw new Error('Transaction not found');
    res.status(200).json(transaction);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


// Update a Transaction by id
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [numRows, [updatedTransaction]] = await Transaction.update(req.body, {
      where: { id },
      returning: true,
    });
    if (numRows !== 1) throw new Error('Transaction not found');
    res.status(200).json(updatedTransaction);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Delete a Transaction by id
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const numRows = await Transaction.destroy({ where: { id } });
    if (numRows !== 1) throw new Error('Transaction not found');
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
