require('dotenv').config();

module.exports = {
    port: parseInt(process.env.PORT || '8080', 10),
    host: '0.0.0.0',
    maxConcurrentJobs: parseInt(process.env.MAX_CONCURRENT_JOBS || '10', 10),
    jobTimeoutMs: parseInt(process.env.JOB_TIMEOUT_MS || '30000', 10)
}; 