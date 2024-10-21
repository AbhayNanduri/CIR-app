const Student = require("../models/student");

module.exports.showAnalytics = async (req, res) => {
  try {
    const students = await Student.find({});
    res.sendFile('analytics.html', { root: './public' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching analytics data');
  }
};


module.exports.getAnalyticsData = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching analytics data' });
  }
};
