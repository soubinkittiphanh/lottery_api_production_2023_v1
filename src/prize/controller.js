
const Prize = require("../model").prize

exports.createPrize = async (req, res) => {
  const duplicateBranchCheck = await duplicateBranch(req.body.branchId);
  if(duplicateBranchCheck){
    return res.status(404).json({ message: 'ສາຂານີ້ ໄດ້ຕັ້ງອັດຕາຈ່າຍໄວ້ແລ້ວ' });
  }
  try {
    const prize = await Prize.create(req.body);
    res.status(200).json(prize);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPrizes = async (req, res) => {
  try {
    const prizes = await Prize.findAll({ include: 'branch' });
    res.status(200).json(prizes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPrizeById = async (req, res) => {
  const { id } = req.params;
  try {
    const prize = await Prize.findByPk(id, { include: 'branch' });
    if (!prize) {
      return res.status(404).json({ message: 'Prize not found' });
    }
    res.status(200).json(prize);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updatePrize = async (req, res) => {
  const { id } = req.params;
  const { two, three, four, five, six, isActive, branchId } = req.body;
  try {
    const updatedPrize = await Prize.update(
      {
        two,
        three,
        four,
        five,
        six,
        isActive,
        branchId,
      },
      { where: { id } }
    );
    if (updatedPrize[0] === 0) {
      return res.status(404).json({ message: 'Prize not found' });
    }
    res.status(200).json({ message: 'Prize updated successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deletePrize = async (req, res) => {
  const { id } = req.params;
  try {
    const rowsDeleted = await Prize.destroy({ where: { id } });
    if (!rowsDeleted) {
      return res.status(404).json({ message: 'Prize not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const duplicateBranch = async (branchId) => {
  try {
    const prize = await Prize.findOne({where:{branchId},  include: 'branch' });
    if (!prize) {
      return false;
    }
    return true
  } catch (err) {
    console.error(err);
    return false
  }
}
