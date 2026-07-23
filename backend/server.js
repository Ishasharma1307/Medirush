const app = require('./app');

// Defines the port our server will listen on
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running smoothly on http://localhost:${PORT}`);
});
