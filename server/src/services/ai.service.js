const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const prioritizeTasks = async (tasks) => {
  const taskList = tasks.map((t, i) =>
    `${i + 1}. Title: "${t.title}" | Priority: ${t.priority} | Status: ${t.status} | ID: ${t.id}`
  ).join('\n');

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `You are a productivity assistant. Based on these tasks, decide which should be done Today, This Week, or kept in Backlog.

Tasks:
${taskList}

Respond ONLY with a JSON array like this:
[
  { "id": 1, "status": "today", "reason": "High priority and urgent" },
  { "id": 2, "status": "thisweek", "reason": "Important but not urgent" },
  { "id": 3, "status": "backlog", "reason": "Low priority" }
]

Only return the JSON array, nothing else.`
      }
    ],
    model: 'llama-3.3-70b-versatile',
  });

  const text = completion.choices[0].message.content;
  console.log('Groq response:', text);
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { prioritizeTasks };