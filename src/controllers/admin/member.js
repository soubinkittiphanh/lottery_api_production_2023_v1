const db = require("../../config/dbconn");
const dbAsync = require("../../config/dbconnPromise");
const bcrypt = require("../../../custom-bcrypt");
const logger = require("../../api/logger");
const createMember = async (req, res) => {
  console.log("::::::::::::::create user::::::::::::::");
  const name = req.body.name;
  const lname = req.body.lname;
  const logid = req.body.logid;
  const logpass = bcrypt.hash(req.body.logpass);
  const vill = req.body.vill;
  const dist = req.body.dist;
  const pro = req.body.pro;
  const active = req.body.active;
  const admin = req.body.admin;
  const rec = req.body.mem_rec;
  const tel = req.body.mem_tel;
  const com_sale = req.body.com_sale;
  const com_win = req.body.com_win;
  const group_code = req.body.group_code;
  const brc_code = req.body.brc_code;
  console.log(rec);
  console.log(tel);

  console.log("::::::::::::::LICENSE CREATE USER::::::::::::::");
  await db.query(
    "SELECT app_max,COUNT(mem_id) AS mem_id FROM tbl_license, member WHERE app_name='member'",
    (err, result) => {
      if (err) {
        res.send("ເກີດຂໍ້ຜິດພາດການກວດສອບ (MAXIMUM)");
      } else {
        console.log(
          "RESULTS BRANCH:" +
          result[0]["mem_id"] +
          " MAX: " +
          result[0]["app_max"]
        );
        if (result[0]["mem_id"] < result[0]["app_max"]) {
          console.log("::::::::::::::LICENSE CREATE USER ALLOW::::::::::::::");

          db.query(
            `SELECT mem_id FROM member WHERE mem_name='${name}'`,
            (err, result) => {
              if (err) {
                res.send("ເກີດຂໍ້ຜິດພາດ: " + err);
              } else {
                if (result.length >= 1) {
                  res.send("ເກີດຂໍ້ຜິດພາດ: ຊື່ຜູ້ໃຊ້ງານຊ້ຳກັນ Douplicate data");
                } else {
                  db.query(
                    "INSERT IGNORE INTO `member`( `mem_id`,`brc_code`,`group_code`, `mem_pass`, `mem_name`, `mem_lname`, `mem_village`, `mem_dist`, `mem_pro`, `active`, `admin`,`mem_rec`,`mem_tel`,`com_sale`,`com_win`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [
                      logid,
                      brc_code,
                      group_code,
                      logpass,
                      name,
                      lname,
                      vill,
                      dist,
                      pro,
                      active,
                      admin,
                      rec,
                      tel,
                      com_sale,
                      com_win,
                    ],
                    (err, result) => {
                      if (err) {
                        console.log(err);
                        res.send("ເກີດຂໍ້ຜິດພາດທາງເຊີເວີ້!!!!");
                      } else {
                        res.send("ເພີ່ມຂໍ້ມູນສຳເລັດ");
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          console.log(
            "::::::::::::::LICENSE CREATE USER REACH MAXIMUM::::::::::::::"
          );
          res.send("ດຳເນີນການບໍ່ສຳເລັດ ສະມາຊິກເກີນຂະຫນາດຂອງເຊີເວີ");
        }
      }
    }
  );
};
const updateMember = async (req, res) => {
  console.log("::::::::::::::UPDATE USER::::::::::::::");
  console.log("UPDATE USER");
  const id = req.body.id;
  const name = req.body.name;
  const lname = req.body.lname;
  const logid = req.body.logid;
  const logpass = bcrypt.hash(req.body.logpass); //req.body.logpass;
  const vill = req.body.vill;
  const dist = req.body.dist;
  const pro = req.body.pro;
  const active = req.body.active;
  const admin = req.body.admin;
  const rec = req.body.mem_rec;
  const tel = req.body.mem_tel;
  const com_sale = req.body.com_sale;
  const com_win = req.body.com_win;
  const brc_code = req.body.brc_code;
  const group_code = req.body.group_code;
  console.log("up id" + id);
  console.log("up id" + name);
  await db.query(
    "UPDATE `member` SET `mem_id`=?,`brc_code`=?,`mem_name`=?,`mem_lname`=?,`mem_village`=?,`mem_dist`=?,`mem_pro`=?,`active`=?,`admin`=?,`mem_rec`=?,`mem_tel`=?,`com_sale`=?,`com_win`=?,`group_code`=? WHERE `id`=?",
    [
      logid,
      brc_code,
      name,
      lname,
      vill,
      dist,
      pro,
      active,
      admin,
      rec,
      tel,
      com_sale,
      com_win,
      group_code,
      id,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("ເກີດຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ");
      } else {
        res.send("ອັບເດດຂໍ້ມູນຮຽບຮ້ອຍ");
      }
    }
  );
};
//::::::::::::::RESET PASSWORD::::::::::::::
const resetPassword = async (req, res) => {
  console.log("//::::::::::::::RESET PASSWORD::::::::::::::");
  const id = req.body.id;
  const logpass = bcrypt.hash(req.body.logpass); //req.body.logpass;
  console.log("up id" + id);
  await db.query(
    "UPDATE `member` SET `mem_pass`=? WHERE `id`=?",
    [logpass, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send("ເກີດຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ");
      } else {
        res.send("ອັບເດດຂໍ້ມູນຮຽບຮ້ອຍ");
      }
    }
  );
};

//::::::::::::::GEN MEMID::::::::::::::
const genId = async (req, res) => {
  console.log("//::::::::::::::GEN MEMID::::::::::::::");
  await db.query(
    "SELECT MAX(mem_id) AS mem_id FROM `member` HAVING MAX(mem_id) IS NOT null ",
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        if (result.length < 1) {
          res.send((result = [{ mem_id: 1000 }]));
        } else {
          res.send(result);
        }
      }
    }
  );
};
//::::::::::::::FETCH MEMBERID::::::::::::::
const getMemberById = async (req, res) => {
  const param_id = req.query.id;
  console.log("//::::::::::::::FETCH MEMBER ID::::::::::::::");
  console.log("USER ID: " + param_id);
  const sql_query = " SELECT * FROM `member` WHERE id = " + param_id;
  await db.query(sql_query, (err, result) => {
    if (err) {
      console.log(err);
      res.send("ເກີດຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ: " + err);
    } else {
      res.send(result);
    }
  });
};
//::::::::::::::FETCH MEMBER::::::::::::::
const getMember = async (req, res) => {
  console.log("//::::::::::::::FETCH MEMBER::::::::::::::");
  const p_master = req.query.p_master;
  const p_mem_id = req.query.p_mem_id;
  console.log(p_mem_id + "======" + p_master);
  let sql = `SELECT m.*, SUM(s.sale_price ) AS total,win.sale_num,win.sale_price,win.win_amount FROM member m 
  LEFT JOIN sale s ON m.mem_id=s.mem_id AND s.is_cancel=0 AND s.ism_id=(SELECT MAX(i.ism_ref) FROM installment i) 
  LEFT JOIN (SELECT s.*,i.ism_result,SUM(s.sale_price*(SELECT IF(LENGTH(s.sale_num)=2,pay_two,
  IF(LENGTH(s.sale_num)=3,pay_three,IF(LENGTH(s.sale_num)=4,pay_four,IF(LENGTH(s.sale_num)=5,pay_five,pay_six)))) FROM payrate where id=1) /1000) AS win_amount FROM installment i 
  RIGHT JOIN sale s ON s.ism_id=i.ism_ref AND s.is_cancel=0 WHERE i.ism_date =(SELECT MAX(ism_date) FROM installment) 
  AND (s.sale_num = SUBSTRING(i.ism_result, -6, 6) 
  OR s.sale_num = SUBSTRING(i.ism_result, -5, 5) 
  OR s.sale_num = SUBSTRING(i.ism_result, -4, 4) 
  OR s.sale_num = SUBSTRING(i.ism_result, -3, 3) 
  OR s.sale_num = SUBSTRING(i.ism_result, -2, 2)) GROUP BY s.mem_id  
  ORDER BY s.id DESC) AS win ON win.mem_id=m.mem_id 
  WHERE m.mem_id IN (SELECT mn.mem_id  FROM member mn WHERE mn.brc_code=(SELECT m.brc_code FROM member m 
    WHERE m.mem_id='${p_mem_id}' ) ) GROUP BY m.id ORDER BY total desc,m.mem_name`;
  if (p_master == 1) {
    console.log("::::::::::MASTER REPORT:::::::");
    sql =
      `SELECT m.*, SUM(s.sale_price ) AS total,win.sale_num,win.sale_price,win.win_amount FROM member m 
      LEFT JOIN sale s ON m.mem_id=s.mem_id AND s.is_cancel=0 AND s.ism_id=(SELECT MAX(i.ism_ref) FROM installment i) 
      LEFT JOIN (SELECT s.*,i.ism_result,SUM(s.sale_price*(SELECT IF(LENGTH(s.sale_num)=2,pay_two,IF(LENGTH(s.sale_num)=3,pay_three,
      IF(LENGTH(s.sale_num)=4,pay_four,IF(LENGTH(s.sale_num)=5,pay_five,pay_six)))) FROM payrate where id=1) /1000) AS win_amount 
      FROM installment i RIGHT JOIN sale s ON s.ism_id=i.ism_ref AND s.is_cancel=0 
      WHERE i.ism_date =(SELECT MAX(ism_date) FROM installment) 
      AND (s.sale_num = SUBSTRING(i.ism_result, -6, 6) OR s.sale_num = SUBSTRING(i.ism_result, -5, 5) 
      OR s.sale_num = SUBSTRING(i.ism_result, -4, 4) OR s.sale_num = SUBSTRING(i.ism_result, -3, 3) 
      OR s.sale_num = SUBSTRING(i.ism_result, -2, 2)) GROUP BY s.mem_id  ORDER BY s.id DESC) AS win ON win.mem_id=m.mem_id 
      GROUP BY m.id ORDER BY total desc,m.mem_name`;
  }
  /*
  SELECT s.*,mem.*,p.* FROM sale s LEFT JOIN (SELECT m.mem_id, b.co_code,b.id FROM member m LEFT JOIN branch b ON m.brc_code = b.co_code) mem ON mem.mem_id = s.mem_id LEFT JOIN payrate p ON p.branch_id = mem.id WHERE s.ism_id='10304' and s.is_cancel=0 AND s.sale_num AND s.sale_num IN('648723','48723','8723','723','23') 
  SELECT s.*,mem.*,p.*,SUM(s.sale_price)as group_sale_total FROM sale s LEFT JOIN (SELECT m.mem_id, b.co_code,b.id FROM member m LEFT JOIN branch b ON m.brc_code = b.co_code) mem ON mem.mem_id = s.mem_id LEFT JOIN payrate p ON p.branch_id = mem.id WHERE s.ism_id='10304' and s.is_cancel=0 AND s.sale_num AND s.sale_num IN('648723','48723','8723','723','23') GROUP BY s.sale_num, mem.co_code 
  */
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.send("ເກີດຂໍ້ຜິດພາດທາງດ້ານເຊີເວີ: " + err);
    } else {
      res.send(result);
    }
  });
};
const winSaleReport = async (req, res) => {
  // const query = `SELECT s.*,mem.*,p.*,SUM(s.sale_price)as group_sale_total FROM sale s LEFT JOIN (SELECT m.mem_id, b.co_code,b.id FROM member m LEFT JOIN branch b ON m.brc_code = b.co_code) mem ON mem.mem_id = s.mem_id LEFT JOIN payrate p ON p.branch_id = mem.id WHERE s.ism_id='10304' and s.is_cancel=0 AND s.sale_num AND s.sale_num IN('648723','48723','8723','723','23') GROUP BY s.sale_num, mem.co_code `
  // const query = `SELECT s.sale_num,s.ism_id,mem.co_code,p.pay_two,p.pay_three,p.pay_four,p.pay_five,p.pay_six,SUM(s.sale_price)as sale_price FROM sale s LEFT JOIN (SELECT m.mem_id, b.co_code,b.id FROM member m LEFT JOIN branch b ON m.brc_code = b.co_code) mem ON mem.mem_id = s.mem_id LEFT JOIN payrate p ON p.branch_id = mem.id WHERE s.ism_id=(SELECT MAX(ism_ref) FROM installment) and s.is_cancel=0 AND s.sale_num GROUP BY s.sale_num, mem.co_code `
  const query = `SELECT s.sale_num,s.ism_id,mem.co_code,mem.co_comm,p.pay_two,p.pay_three,p.pay_four, p.pay_five,p.pay_six,SUM(s.sale_price)as sale_price,i.ism_result FROM sale s LEFT JOIN (SELECT m.mem_id, b.co_code,b.id,b.co_comm FROM member m LEFT JOIN branch b ON m.brc_code = b.co_code) mem ON mem.mem_id = s.mem_id LEFT JOIN payrate p ON p.branch_id = mem.id LEFT JOIN installment i ON i.ism_ref=s.ism_id WHERE s.ism_id=(SELECT MAX(ism_ref) FROM installment) and s.is_cancel=0 AND s.sale_num GROUP BY s.sale_num, mem.co_code `

  try {
    const [rows, fields] = await dbAsync.query(query)

    res.send(await transformReport(rows, fields))
  } catch (error) {
    res.send("Error " + error)
  }

}

const getMainPayrate = async () => {
  const query = `SELECT * FROM payrate where id = 1`
  try {
    const [rows, fields] = await dbAsync.query(query)
    for (const iterator of fields) {
      logger.warn("Field name => " + iterator.name)
    }
    logger.info("Main payrate =>" + rows.length)
    return rows[0]
  } catch (error) {
    logger.error("Cannot get main payrate " + error)
    return null
  }
}

const memberSaleReport = async (req, res) => {
  const query = `SELECT s.ism_id,s.sale_num,s.mem_id,s.sale_bill_id,s.sale_price,mem.mem_name,mem.co_code, mem.co_name,mem.branch_commision_rate,mem.com_sale AS user_com_sale,mem.com_win AS user_com_win,i.ism_result,p.* FROM sale s LEFT JOIN (SELECT m.mem_id,m.mem_name,m.com_sale,m.com_win,b.id, b.co_code, b.co_name,b.co_comm as branch_commision_rate FROM member m LEFT JOIN branch b ON b.co_code=m.brc_code) mem ON mem.mem_id= s.mem_id LEFT JOIN installment i ON i.ism_ref=s.ism_id LEFT JOIN payrate p ON p.branch_id=mem.id WHERE s.ism_id=(SELECT MAX(ism_ref) FROM installment) AND s.is_cancel=0 `
  // const mainPayrate = await getMainPayrate()
  try {
    const [rows, fields] = await dbAsync.query(query)

    return res.send(await transformReport(rows, fields))
  } catch (error) {
    logger.error(error)
    res.send(error)
  }
}
const transformReport = async (rows, fields) => {
  // ************** Check what is the default payrate **************//
  const mainPayrate = await getMainPayrate()
  let grandWinTotal = 0;
  let grandSaleTotal = 0;
  const result_luck_number_6 = rows[0]['ism_result']
  const result_luck_number_5 = rows[0]['ism_result'].substring(1)
  const result_luck_number_4 = rows[0]['ism_result'].substring(2)
  const result_luck_number_3 = rows[0]['ism_result'].substring(3)
  const result_luck_number_2 = rows[0]['ism_result'].substring(4)
  for (const iterator of rows) {
    // ************** Assign default payrate to those branch has not set payrate **************
    if (iterator['branch_id'] == null) {
      iterator['branch_id'] = mainPayrate['branch_id']
      iterator['pay_two'] = mainPayrate["pay_two"]
      iterator['pay_three'] = mainPayrate["pay_three"]
      iterator['pay_four'] = mainPayrate["pay_four"]
      iterator['pay_five'] = mainPayrate["pay_five"]
      iterator['pay_six'] = mainPayrate["pay_six"]
    }
    // logger.warn("===> Len digits " + iterator['sale_num'].length)
    // ************** Assign customer win amount (Prize) base on branch pay rate **************
    switch (iterator['sale_num'].length) {
      case 6:
        iterator['prize'] = iterator['sale_num'] === result_luck_number_6 ? iterator['sale_price'] * iterator['pay_six'] / 1000 : 0
        break;
      case 5:
        iterator['prize'] = iterator['sale_num'] === result_luck_number_5 ? iterator['sale_price'] * iterator['pay_five'] / 1000 : 0
        break;
      case 4:
        iterator['prize'] = iterator['sale_num'] === result_luck_number_4 ? iterator['sale_price'] * iterator['pay_four'] / 1000 : 0
        break;
      case 3:
        iterator['prize'] = iterator['sale_num'] === result_luck_number_3 ? iterator['sale_price'] * iterator['pay_three'] / 1000 : 0
        break;
      default:
        iterator['prize'] = iterator['sale_num'] === result_luck_number_2 ? iterator['sale_price'] * iterator['pay_two'] / 1000 : 0
        break;
    }
    grandWinTotal += +iterator['prize']
    grandSaleTotal += +iterator['sale_price']

  }
  const fieldList = [];
  for (const iterator of fields) {
    fieldList.push(iterator.name)
  }
  logger.warn('===> count all transaction = ' + rows.length)
  // let rowsWin = []
  let rowsWin = rows.filter(el => el.prize > 0)
  // rowsWin = [...rowsWinTem]
  logger.warn('===> count win transaction = ' + rowsWin.length)
  // ************* Ad last local field *************
  fieldList.push('prize')
  fieldList.push('grandTotalSale')
  // ************* Summary sale grouping by co_code *************
  let unRowsWin = rows.filter(el => el['prize'] <= 0)
  logger.info("===> Unwin rows count " + unRowsWin.length)
  for (const iterator of rowsWin) {
    iterator['grandTotalSale'] = 0;
    for (const iteratorItem of rows) {
      if (iteratorItem['co_code'] == iterator['co_code']) {
        iterator['grandTotalSale'] += +iteratorItem['sale_price']
      } else {
        // iteratorItem['grandTotalSale'] = iteratorItem['sale_price']
        // rowsWin.push(iteratorItem)
      }
    }
  }
  let grandSaleTotalNotWin = 0
  let grandSaleWinPrincipal = 0;
  // ************* Push un win rows to win rows *************
  // for (const iterator of rows) {
  //   if (rowsWin.indexOf(iterator) < 0) {
  //     // ************* Find all sale amount [not win] *************
  //     grandSaleTotalNotWin += +iterator['sale_price']
  //     unRowsWin.push(iterator)
  //   }
  // }

  // ************* Find all sale amount *************
  for (const iterator of rowsWin) {
    grandSaleWinPrincipal += +iterator['sale_price']
  }
  const totalPriceWin = rowsWin.reduce((accumulator, item) => accumulator + (+item.sale_price), 0);
  const totalPriceNotWin = unRowsWin.reduce((accumulator, item) => accumulator + (+item.sale_price), 0);

  logger.info(`Win: ${totalPriceWin} `)
  logger.info(`NotWin: ${totalPriceNotWin} `)
  logger.info(`Total: ${totalPriceNotWin + totalPriceWin} `)
  const bothRows = combineArrays(rowsWin, unRowsWin)
  const totalPriceBothRows = bothRows.reduce((accumulator, item) => accumulator + (+item.grandTotalSale), 0);
  logger.error(`len:  =>${totalPriceBothRows}`)
  rowsWin = groupTransactionByBranch(rowsWin.concat(unRowsWin), unRowsWin)
  const totalSaleInWinRows = rowsWin.reduce((accumulator, item) => {
    return accumulator + item['sale_price'];
  }, 0);
  // logger.warn('==> rows1 total '+rows1.length)
  // logger.warn('==> rows total '+rows.length)
  return { bothRows, rows, rowsWin, unRowsWin, fieldList, grandWinTotal, grandSaleTotal, grandSaleTotalNotWin, grandSaleWinPrincipal, totalSaleInWinRows }
}

groupTransactionByBranch = (rowsWin, unRowsWin) => {
  logger.info('win=>' + rowsWin.length)
  logger.info('not win=>' + unRowsWin.length)
  // rowsWin.concat(unRowsWin)
  logger.info('win+unwin=>' + rowsWin.length)
  for (const iterator of rowsWin) {
    for (const iterator2 of unRowsWin) {
      if (iterator['co_code'] === iterator2['co_code']) {
        // logger.error("Sale amount => "+iterator2['sale_price'])
        iterator['sale_price'] = (+iterator2['sale_price']) + (+iterator['sale_price'])
      }
    }
  }
  return rowsWin
}

const combineArrays = (arr1, arr2) => {
  const combined = [...arr1, ...arr2];

  const grouped = Object.values(combined.reduce((acc, item) => {
    if (!acc[item.co_code]) {
      // logger.error(`not existing ${item.sale_price}`)
      // acc[item.co_code] = { ...item, total: +item.sale_price };
      acc[item.co_code] = { ...item, grandTotalSale: +item.sale_price };
    } else {
      // logger.error(`existing ${item.sale_price}`)
      acc[item.co_code].grandTotalSale += +item.sale_price;
    }

    return acc;
  }, {}));

  return grouped;
}
module.exports = {
  genId,
  createMember,
  updateMember,
  getMember,
  getMemberById,
  resetPassword,
  winSaleReport,
  memberSaleReport
};
