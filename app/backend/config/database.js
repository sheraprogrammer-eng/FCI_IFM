const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

class Database {
    constructor() {
        this.pool = null;
    }

    async connect() {
        try {
            this.pool = await sql.connect(config);
            console.log('Connected to SQL Server');
            return this.pool;
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        }
    }

    async getPool() {
        if (!this.pool) {
            await this.connect();
        }
        return this.pool;
    }

    async close() {
        if (this.pool) {
            await this.pool.close();
            this.pool = null;
        }
    }
}

module.exports = new Database();