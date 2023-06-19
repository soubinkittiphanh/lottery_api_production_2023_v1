const logger = require("../../api/logger");
const db = require("../../config/dbconn");
const dbAsync = require("../../config/dbconnPromise");
const getPayRate = async (req, res) => {
  console.log("//::::::::::::::PAYRATE FETCH::::::::::::::");
  db.query("SELECT * FROM payrate", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
};
//::::::::::::::UPDATE PAYRATE::::::::::::::
const updatePayRate = async (req, res) => {
  logger.info("//::::::::::::::UPDATE PAYRATE::::::::::::::");
  const id = req.query.id;
  const { two, three, four, five, six } = req.body;
  logger.info('Branch id ' + id);
  const insertQuery = `INSERT INTO payrate(branch_id, pay_two, pay_three, pay_four, pay_five, pay_six) 
  VALUES (${id},${two}, ${three}, ${four}, ${five}, ${six})`
  const updateQuery = `UPDATE payrate SET pay_two=${two},pay_three=${three},pay_four=${four},pay_five=${five},pay_six=${six} WHERE branch_id=${id}`
  try {
    let whichQuery = insertQuery
    if (await findBranch(id)) {
      whichQuery = updateQuery
    }
    const [rows, fields] = await dbAsync.query(whichQuery)
    logger.info("SQL Message => " + rows.message)
    res.send("ອັບເດດຂໍ້ມູນຮຽບຮ້ອຍ");
  } catch (error) {
    res.send("ມີຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ!" + error);
  }


  // db.query(,
  //   (er, result) => {
  //     if (er) {
  //       res.send("ມີຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ!");
  //     } else {
  //       res.send("ອັບເດດຂໍ້ມູນຮຽບຮ້ອຍ");
  //     }
  //   }
  // );
};

const findBranch = async (id) => {
  const query = `SELECT * FROM payrate WHERE branch_id =${id}`
  try {
    const [rows, fields] = await dbAsync.query(query)
    if (rows.length > 0) {
      logger.info("Payrate already setup for this branch go for update")
      return true
    } else {
      logger.info("Payrate not yet setup for this branch go for insert")
      return false
    }
  } catch (error) {
    logger.error("Server error cannot get data from payrate "+error)
    return branchId;
  }

}

module.exports = {
  getPayRate,
  updatePayRate,
};
