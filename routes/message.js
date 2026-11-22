const express = require('express');
const router = express.Router();

let messageBoard = [
    { id: 1, name: 'Jane', content: 'First comment', createdAt: '2026/12/13 11:54:30' },
    { id: 2, name: 'Brown', content: 'Hi, my name is Brown.', createdAt: '2026/12/13 23:59:59' },
];

let nextId = 3;

router.get('/', (req, res) => {
    const { page, limit } = req.query;
    const sortedMessages = [...messageBoard].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if(page !== undefined && limit !== undefined) {
        const rangeMessage = sortedMessages.slice((page - 1) * limit, page * limit);
        return res.json(rangeMessage);
    }
    res.json(sortedMessages);
});

router.get('/:id', (req, res) => {
    const message = messageBoard.find((m) => m.id === Number(req.params.id));
    if(!message) return res.status(404).json({ error: 'Can\'t find this comment.' });
    res.json(message);
});

router.post('/', (req, res) => {
  const { name, comment } = req.body;
  if (typeof comment !== 'string' || comment.trim() === '') {
    return res.status(400).json({ error: 'comment 為必填' });
  }

  const formattedTime = new Date().toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hour12: false,
  });

  const formattedName = typeof name === 'string' && name.trim() !== '' ? name.trim() : 'Anonymous';
  const newComment = { id: nextId++, name: formattedName, content: comment.trim(), createdAt: formattedTime };
  messageBoard.push(newComment);
  res.status(201).json(newComment);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = messageBoard.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Can\'t find this message.' });
  }

  const formattedTime = new Date().toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    hour12: false,
  });

  const { name, comment } = req.body;
  if (typeof comment !== 'string') {
    return res.status(400).json({ error: 'Need to provide comment(string).' });
  }

  const formattedName = typeof name === 'string' ? name : 'Anonymous';

  messageBoard[index] = {
    id,
    name: formattedName,
    content: comment.trim(),
    createdAt: formattedTime
  };
  res.json(messageBoard[index]);
});

router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const messages = messageBoard.find((m) => m.id === id);
  if (!messages) {
    return res.status(404).json({ error: 'Can\'t find this comment.' });
  }

  const { name, comment } = req.body;
  messages.name = name !== undefined ? name : 'Anonymous';
  if (comment !== undefined) messages.comment = comment;
  res.json(messages);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const exists = messageBoard.some((m) => m.id === id);
  if (!exists) {
    return res.status(404).json({ error: 'Can\'t find this comment.' });
  }

  messageBoard = messageBoard.filter((m) => m.id !== id);
  res.sendStatus(204);
});

module.exports = router;