const { Pool } = require('pg');
const databaseConfiguration = require('./secrets/databaseConfigurations.js')

const pool = new Pool(databaseConfiguration);

module.exports = pool;
