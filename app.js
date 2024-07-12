const { connectToDatabase } = require('./app/database/connect');
connectToDatabase();

const { loadRouters } = require('./app/router/router');
loadRouters();
