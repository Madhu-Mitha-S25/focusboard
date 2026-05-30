const db = require('../config/db');
const { prioritizeTasks } = require('../services/ai.service');

const planMyDay = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM tasks WHERE user_id = $1',
      [req.user.id]
    );

    const tasks = result.rows;
    console.log('Tasks found:', tasks.length);

    if (tasks.length === 0) {
      return res.status(400).json({ message: 'No tasks found to prioritize' });
    }

    console.log('Calling Gemini API...');
    const prioritized = await prioritizeTasks(tasks);
    console.log('Gemini result:', prioritized);

    for (const item of prioritized) {
      await db.query(
        'UPDATE tasks SET status = $1 WHERE id = $2 AND user_id = $3',
        [item.status, item.id, req.user.id]
      );
    }

    res.json({
      message: 'Tasks prioritized by AI!',
      results: prioritized
    });

  } catch (err) {
    console.error('FULL ERROR:', err);
    res.status(500).json({ message: 'AI error', error: err.message });
  }
};

module.exports = { planMyDay };