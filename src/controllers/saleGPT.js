
const sale = async (req, res) => {
    console.log("//::::::::::::::SALE::::::::::::::");
    const { item, user, ism, qr_code } = req.body;
    logger.info(`ISM===>${ism}`)
    logger.info(`ITEM0===>${item[0]}`)
    let listOfOverNumber = [];
    // let branch;
    // TODO: Improve sale process logic
    // MANUAL ALLOW 5,6 NUMBER SALE
    // ********* CHECK WHERE IS THE USER BRANCH ********
    const branch = await saleService.takeUserBranch(user);
    // END MANUAL ALLOW 5,6 NUMBER SALE
    // ************** CHECK IF ANY NUMBER IS ALREADY OVER LIMINTED ************ //
    for (var i = 0; i < item.length; i++) {
        console.log("For: " + item[i].lek + " Laka:" + item[i].sale);
        const luck_num = item[i].lek;
        const price_buy = item[i].sale;
        const isfull = await fullLotCheck(luck_num, price_buy, ism, branch);
        console.log("isfull: " + isfull);
        if (isfull !== "passed") {
            listOfOverNumber.push({ item: isfull });
        }
    }
    // ************ FORM SQL COMMAND FOR MULTI ROWS INSERT ************
    if (listOfOverNumber.length < 1) {
        logger.error("Total transaction: " + item.length);
        const bill_num = await get_billnum();
        const sqlCommand = formSqlCommandForMultiRows(item, bill_num, ism, user, qr_code)
        logger.info("SQL: " + sqlCommand);
        try {
            const [rows, fields] = await dbAsync.query(sqlCommand)
            listOfOverNumber.push({
                item: "ສຳເລັດການຂາຍ",
                bill_num: String(bill_num),
            });
            logger.info("Transaction completed")
            return res.send(listOfOverNumber);
        } catch (error) {
            logger.error("Database error: ", error)
            return res.send("ເກີດຂໍ້ຜິດພາດທາງເຊີເວີ SQL query");
        }

    } else {
        res.send(listOfOverNumber);
    }
};
const formSqlCommandForMultiRows = (sale, bill_num, ism, user, qr_code) => {
    let sqlValueConcatination = '';
    for (let i = 0; i < sale.length; i++) {
        const colon = i < sale.length - 1 ? "," : ";";
        sqlValueConcatination +=
            "(" +
            bill_num +
            "," +
            ism +
            ",'" +
            sale[i].lek +
            "'," +
            sale[i].sale +
            "," +
            user +
            ",'" +
            sale[i].date +
            "'," +
            qr_code +
            ")" +
            colon +
            "";
    }
    const sqlCommand = `INSERT INTO sale(sale_bill_id, ism_id, sale_num, sale_price, mem_id, client_date,qr_code) VALUES${sqlValueConcatination} `
    return sqlCommand
}
async function get_billnum() {
    const [rows, fields] = await dbAsync.query(
        `SELECT MAX(sale_bill_id) as pre_bill FROM sale HAVING MAX(sale_bill_id) IS NOT null`
    );
    if (rows.length < 1) {
        return 214303061761012;
    } else {
        const next_ref = BigInt(rows[0].pre_bill) + 1n;
        return next_ref;
    }
}

// ****************** CHAT GPT LOGIC **************
const fullLotCheck = async (luck_num, price, ism_ref, brc) => {
    let luck_num_type = "";
    const luckNLen = luck_num.length;
    let sqlComMax;
    let sqlConditn = `IN ('${brc}')`;

    // Check if the length of the luck_num is valid
    if (luckNLen < 2 || luckNLen > 6) {
        const isover = [`ເລກ: ${luck_num} ຕ້ອງຊື້ ສອງໂຕ ${luckNLen} ຂື້ນໄປ`];
        return isover;
    }

    console.log("Number: " + luck_num + " Price: " + price + " ISM: " + ism_ref);
    try {
        // Check if the branch is valid
        const [rows, fields] = await dbAsync.query(`SELECT l.brc_code FROM salelimit l WHERE l.brc_code='${brc}'`);
        if (rows.length == 0) {
            brc = "DEFAULT";
            sqlConditn = `NOT IN (SELECT BRC_CODE FROM salelimit WHERE BRC_CODE NOT IN('${brc}'))`;
        }

        // Construct the SQL query to fetch the maximum sale limit and check if the transaction is over
        switch (luckNLen) {
            case 2:
                luck_num_type = "two_digits";
                break;
            case 3:
                luck_num_type = "three_digits";
                break;
            case 4:
                luck_num_type = "four_digits";
                break;
            case 5:
                luck_num_type = "five_digits";
                break;
            case 6:
                luck_num_type = "six_digits";
                break;
        }
        sqlComMax = `
            SELECT IFNULL(SUM(s.sale_price),0) AS total, IFNULL(l.${luck_num_type},0) AS maxsale 
            FROM branch b
            LEFT JOIN member m ON m.brc_code=b.co_code
            LEFT JOIN sale s ON s.mem_id=m.mem_id AND s.ism_id=${ism_ref} AND s.is_cancel=0 AND s.sale_num='${luck_num}'
            LEFT JOIN salelimit l ON l.brc_code='${brc}'
            WHERE b.co_code ${sqlConditn}`;
        const isOver = await fullLotCheckSub(sqlComMax, luck_num, price);

        return isOver;
    } catch (error) {
        const isover = [`ເກີດຂໍ້ຜິດພາດ ທາງເຊີເວີ: ${error}`];
        console.log("Error: " + error);
        return isover;
    }
}
const fullLotCheckSub = async (sqlComMax, luck_num, price) => {
    try {
        logger.warn("Start")
        const [rows, fields] = await dbAsync.query(sqlComMax);
        logger.warn("End")
        const availableToSale = rows[0].maxsale - parseInt(rows[0].total);
        const alreadySold = parseInt(rows[0].total);
        const maxSale = parseInt(rows[0].maxsale);
        logger.info("Available to Sale: " + Intl.NumberFormat().format(availableToSale) + " Sold: " + Intl.NumberFormat().format(alreadySold) + " Max: " + Intl.NumberFormat().format(maxSale));
        const isOver = checkIfTransactionIsOver(luck_num, availableToSale, price, maxSale, alreadySold);
        return isOver;
    } catch (error) {
        const isOver = ["ເກີດຂໍ້ຜິດພາດ ທາງເຊີເວີ " + error];
        logger.error("Cannot check number sale limited: " + error);
        return isOver;
    }
}
const checkIfTransactionIsOver = (luck_num, availableToSale, price, maxSale, alreadySold) => {
    if (price < 1000) {
        return ["ເລກ: " + luck_num + " ຕ້ອງຊື້ 1,000 ກີບຂື້ນໄປ"];
    } else if (maxSale < price) {
        logger.error(`Transaction ${luck_num} is over `);
        return ["ເລກ: " + luck_num + " ເຕັມ ວ່າງ: " + Intl.NumberFormat().format(availableToSale) + " ຍອດຕ້ອງການຊື້: " + Intl.NumberFormat().format(price)];
    } else if (maxSale >= alreadySold + price) {
        return "passed";
    } else {
        logger.error(`Transaction ${luck_num} is over `);
        return ["ເລກ: " + luck_num + " ເຕັມ ວ່າງ: " + Intl.NumberFormat().format(availableToSale) + " ຍອດຕ້ອງການຊື້: " + Intl.NumberFormat().format(price)];
    }
}