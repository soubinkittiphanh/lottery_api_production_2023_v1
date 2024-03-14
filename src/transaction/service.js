const { Op, } = require('sequelize');
const logger = require('../api/logger');
const Transaction = require('../model').transaction
const sequelize = require('../config')
const MaxSale = require("../model").maxSale;
const crypto = require('crypto');
const verifyTransactionMax = async (transaction) => {
    const validateTxnResult = []
    logger.info(`Verify transaction`)
    // await masterValidate(transaction)
    // return null;
    const ticketNumber = generateRandomString(16)
    for (const iterator of transaction) {
        const unique = generateRandomString(16)
        iterator['ticketNumber'] = ticketNumber
        iterator['barCode'] = unique
        iterator['dyBarCode'] = unique
        logger.warn(`Unique string ${unique}`)
        const limitedAmount = await findLimitAmount(iterator['branchId'], generateStringByLength(iterator['txnNumber'].length))
        logger.info(`txn number: ${iterator['txnNumber']}`)
        const result = await Transaction.findOne({
            attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']],
            where: {
                [Op.and]: [
                    {
                        txnNumber: {
                            [Op.eq]: iterator['txnNumber']
                        },

                    },
                    // {
                    //     categoryId: {
                    //         [Op.eq]: iterator['categoryId']
                    //     }
                    // },
                    {
                        branchId: {
                            [Op.eq]: iterator['branchId']
                        }
                    },
                    {
                        scheduleId: {
                            [Op.eq]: iterator['scheduleId']
                        }
                    },
                ]
            },
            group: ['txnNumber']
        });
        const total = result ? result.dataValues.total : 0;
        if (total + iterator['amount'] > limitedAmount) {
            validateTxnResult.push({ txn: iterator['txnNumber'], available: limitedAmount - total })
        }
        logger.warn(`total sale for this txn number ${iterator['txnNumber']} is:  ************ ${total} ************`)
        logger.warn(`LUCKY NUMBER: ************ ${iterator['txnNumber']} ************`)
        logger.warn(`SOLD        : ************ ${total} ************`)
        logger.warn(`MAX         : ************ ${limitedAmount} ************`)
        logger.warn(`AVAILABLE   : ************ ${limitedAmount - total} ************`)
    }
    return { validateTxnResult, transaction };
}


const masterValidate = async (transaction) => {
    try {
        const result = await Transaction.findOne({
            attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total'],'txnNumber'],
            where: {
                [Op.and]: [
                    {
                        txnNumber: {
                            [Op.in]: transaction.map(el=>el['txnNumber'])
                        },

                    },
                    // {
                    //     categoryId: {
                    //         [Op.eq]: iterator['categoryId']
                    //     }
                    // },
                    {
                        branchId: {
                            [Op.eq]: transaction[0]['branchId']
                        }
                    },
                    {
                        scheduleId: {
                            [Op.eq]: transaction[0]['scheduleId']
                        }
                    },
                ]
            },
            group: ['txnNumber']
        });
        logger.info(`master validation info ${result}`)
    } catch (error) {
        logger.error(`Master validation error ${error}`)
    }
}

const generateStringByLength = (num) => {
    if (num == 2) {
        return 'twoDigits';
    } else if (num == 3) {
        return 'threeDigits';
    } else if (num == 4) {
        return 'fourDigits';
    } else if (num == 5) {
        return 'fiveDigits';
    } else {
        return 'sixDigits';
    }
};


const findLimitAmount = async (branchId, fieldName) => {
    // Retrieve a single MaxSale record by ID

    try {
        const maxsale = await MaxSale.findOne({
            where: {
                branchId
            }, include: 'branch',
            attributes: [fieldName]
        });
        if (!maxsale) throw new Error('MaxSale not found');
        logger.warn(`Max amount: ${maxsale[fieldName]}`)
        return maxsale[fieldName]
    } catch (err) {
        logger.error(`Cannot find maxsale line for this branch ${branchId} error: ${err}`)
        return null
    }
}


const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

module.exports = { verifyTransactionMax }