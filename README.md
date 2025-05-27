# USDT Payment QR Code Generator Service

An agentic service that generates QR codes for USDT (Tether) payments using natural language input.

## Features

- Natural language input processing
- EIP-681 compliant USDT payment QR codes
- Ethereum address validation
- USDT contract integration
- Asynchronous job processing
- Masumi Agentic Service API compliance

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with the following variables:

```
PORT=3000
MAX_CONCURRENT_JOBS=10
JOB_TIMEOUT_MS=30000
```

## Usage

Start the service:

```bash
node src/server.js
```

### API Endpoints

1. **Start a Job**

   ```
   POST /start_job
   Content-Type: application/json

   {
     "input": "Generate a QR code for 100 USDT payment to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e with label 'Consulting'"
   }
   ```

2. **Check Job Status**

   ```
   GET /status/:jobId
   ```

3. **Get Job Result**

   ```
   GET /result/:jobId
   ```

4. **Check Service Availability**

   ```
   GET /availability
   ```

5. **Get Input Schema**
   ```
   GET /input_schema
   ```

### Example Response

```json
{
  "qrCode": "data:image/png;base64,...",
  "uri": "ethereum:0xdAC17F958D2ee523a2206206994597C13D831ec7/transfer?address=0x742d35Cc6634C0532925a3b844Bc454e4438f44e&uint256=100000000",
  "params": {
    "amount": "100",
    "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "label": "Consulting",
    "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "tokenDecimals": 6
  }
}
```

## Error Handling

The service includes comprehensive error handling for:

- Invalid Ethereum addresses
- Malformed input
- Invalid amounts
- Job processing failures

## License

ISC
