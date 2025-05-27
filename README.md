# Multi-Chain Payment QR Code Generator Service

A service that generates QR codes for cryptocurrency payments using natural language input. Supports multiple chains and tokens.

## Supported Chains and Tokens

- **Ethereum**: ETH, USDT, USDC
- **Polygon**: MATIC, USDT, USDC
- **Solana**: SOL, USDT, USDC
- **Bitcoin**: BTC
- **Cardano**: ADA, USDM

## Features

- Natural language input processing
- Multi-chain support with chain-specific URI formats:
  - EVM chains (Ethereum, Polygon): EIP-681 format
  - Solana: Solana Pay format
  - Bitcoin: BIP21 format
  - Cardano: Cardano URI format
- Chain-specific address validation
- Support for native and token transfers
- Proper decimal handling for different tokens
- Asynchronous job processing
- Web interface for easy QR code generation

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with the following variables:

```
PORT=3010
MAX_CONCURRENT_JOBS=10
JOB_TIMEOUT_MS=30000
```

## Usage

Start the service:

```bash
node src/server.js
```

Access the web interface at:

```
http://localhost:3010/view.html
```

### API Endpoints

1. **Start a Job**

   ```
   POST /start_job
   Content-Type: application/json

   {
     "input": "Generate a QR code for 100 USDT payment on Ethereum to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e with label 'Consulting'"
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

6. **Get Server Configuration**
   ```
   GET /config
   ```

### Example Response

```json
{
  "qrCode": "data:image/png;base64,...",
  "uri": "ethereum:0xdAC17F958D2ee523a2206206994597C13D831ec7/transfer?address=0x742d35Cc6634C0532925a3b844Bc454e4438f44e&uint256=100000000",
  "params": {
    "chain": "ethereum",
    "token": "USDT",
    "amount": "100",
    "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "label": "Consulting",
    "tokenInfo": {
      "name": "Tether USD",
      "symbol": "USDT",
      "decimals": 6,
      "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "isNative": false
    }
  }
}
```

## Error Handling

The service includes comprehensive error handling for:

- Chain-specific address validation
- Invalid token selections
- Malformed input
- Invalid amounts
- Job processing failures

## License

ISC
