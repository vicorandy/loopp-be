const http = require('http');
const app = require('./app');
const { dbConnectionTest } = require('./db/Sequelize');

const { PORT } = process.env;
app.set('port', PORT);

const server = http.createServer(app);

// starting up server and Testing db connection
async function start() {
  try {
    await dbConnectionTest();
    server.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error.message);
  }
}

start();
