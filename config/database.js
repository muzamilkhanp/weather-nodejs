const { Pool } = require('pg');
const constants = require('./../constants');

let pgConnection = null;

const pgConnectionPool = () => {
    if (pgConnection == null) {
        pgConnection = new Pool(constants.database_conf)
    }
    return pgConnection;
}

const execPgQuery = async (query) => {
    const client = pgConnectionPool();
    const result = await client.query(query);
    return result.rows;
}

module.exports = execPgQuery;