const express = require('express');
const messageRouter = require('./routes/message.js');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/messages', messageRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((req, res) => {
  res.status(404).json({error: "Can't find this route."});
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
