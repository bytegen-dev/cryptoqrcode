require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const config = require('./config');
const EthereumQRService = require('./service');

const app = express();
const service = new EthereumQRService();

// Store job states
const jobs = new Map();

app.use(cors());
app.use(express.json());

// Input schema endpoint
app.get('/input_schema', (req, res) => {
    res.json({
        type: 'object',
        properties: {
            input: {
                type: 'string',
                description: 'Natural language input describing the Ethereum payment (e.g., "Generate a QR code for 0.05 ETH payment to 0x123... with label \'Consulting\'")',
                required: true
            }
        }
    });
});

// Service availability endpoint
app.get('/availability', (req, res) => {
    const maxJobs = process.env.MAX_CONCURRENT_JOBS || 10;
    res.json({
        available: jobs.size < maxJobs,
        current_jobs: jobs.size,
        max_jobs: maxJobs
    });
});

// Start job endpoint
app.post('/start_job', async (req, res) => {
    const jobId = crypto.randomUUID();
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({ error: 'Input is required' });
    }

    jobs.set(jobId, {
        status: 'processing',
        startTime: Date.now(),
        input
    });

    // Process job asynchronously
    processJob(jobId, input);

    res.json({
        job_id: jobId,
        status: 'processing'
    });
});

// Job status endpoint
app.get('/status/:jobId', (req, res) => {
    const job = jobs.get(req.params.jobId);
    
    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
        status: job.status,
        error: job.error
    });
});

// Job result endpoint
app.get('/result/:jobId', (req, res) => {
    const job = jobs.get(req.params.jobId);
    
    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status === 'processing') {
        return res.status(202).json({ status: 'processing' });
    }

    if (job.status === 'failed') {
        return res.status(500).json({ error: job.error });
    }

    res.json(job.result);
});

async function processJob(jobId, input) {
    try {
        const result = await service.processJob(input);
        jobs.set(jobId, {
            status: 'completed',
            result,
            completionTime: Date.now()
        });

        // Clean up job after timeout
        setTimeout(() => {
            jobs.delete(jobId);
        }, process.env.JOB_TIMEOUT_MS || 30000);
    } catch (error) {
        jobs.set(jobId, {
            status: 'failed',
            error: error.message,
            completionTime: Date.now()
        });
    }
}

function startServer(port) {
    try {
        app.listen(port, config.host, () => {
            console.log(`Ethereum QR Code Generator Service running on http://${config.host}:${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is in use, trying ${port + 1}`);
                startServer(port + 1);
            } else {
                console.error('Server error:', err);
            }
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

startServer(config.port); 