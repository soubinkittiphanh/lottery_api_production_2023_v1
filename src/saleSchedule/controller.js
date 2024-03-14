
const Schedule = require("../model").schedule
const { body, validationResult } = require('express-validator');
const controller = {
  async getAllSchedules(req, res) {
    try {
      const schedules = await Schedule.findAll({ include: "category" });
      res.json(schedules);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
  async getAllLast5Schedules(req, res) {
    try {
      const schedules = await Schedule.findAll({
        include: "category", order: [["createdAt", "DESC"]],
        limit: 5,
      });
      res.json(schedules);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
  async getAllActiveSchedules(req, res) {
    try {
      const schedules = await Schedule.findAll({ where: { isActive: true }, include: "category" });
      res.json(schedules);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async getScheduleById(req, res) {
    try {
      const schedule = await Schedule.findByPk(req.params.id, { include: "category" });
      if (!schedule) {
        return res.status(404).json({ msg: 'Schedule not found' });
      }
      res.json(schedule);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async createSchedule(req, res) {
    try {
      const { date, result, remark, isActive } = req.body;
      let { categoryId } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // If there are validation errors, return a 400 Bad Request response with the errors
        return res.status(400).json({ errors: errors.array() });
      }
      // ****** Set branch id to Main branch if client not include the fiels
      if (!categoryId) {
        logger.error("No branch id")
        categoryId = 1;
      }
      // return res.send(branchId);
      req.body.categoryId = categoryId;
      const schedule = await Schedule.create({ date, result, remark, isActive, categoryId });
      res.status(200).json(schedule);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async updateScheduleById(req, res) {
    try {
      const { date, result, remark, isActive, categoryId } = req.body;
      let schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) {
        return res.status(404).json({ msg: 'Schedule not found' });
      }
      schedule.date = date;
      schedule.result = result;
      schedule.remark = remark;
      schedule.isActive = isActive;
      schedule.categoryId = categoryId;
      await schedule.save();
      res.json(schedule);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },

  async deleteScheduleById(req, res) {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) {
        return res.status(404).json({ msg: 'Schedule not found' });
      }
      await schedule.destroy();
      res.json({ msg: 'Schedule deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  },
};

module.exports = controller