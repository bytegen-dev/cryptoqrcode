const QRCode = require('qrcode');
const Web3 = require('web3');

class EthereumQRService {
    constructor() {
        this.web3 = new Web3();
        this.jobs = new Map();
    }

    validateEthereumAddress(address) {
        return this.web3.utils.isAddress(address);
    }

    parseInput(input) {
        // Extract amount, address, and label using regex
        const amountMatch = input.match(/(\d*\.?\d+)\s*ETH/i);
        const addressMatch = input.match(/(0x[a-fA-F0-9]{40})/);
        const labelMatch = input.match(/['"]([^'"]+)['"]/);

        if (!amountMatch || !addressMatch) {
            throw new Error('Invalid input format. Please specify amount and Ethereum address.');
        }

        return {
            amount: amountMatch[1],
            address: addressMatch[1],
            label: labelMatch ? labelMatch[1] : ''
        };
    }

    async generateQRCode(params) {
        if (!this.validateEthereumAddress(params.address)) {
            throw new Error('Invalid Ethereum address');
        }

        // Create EIP-681 URI
        const uri = `ethereum:${params.address}?value=${this.web3.utils.toWei(params.amount, 'ether')}`;
        
        // Generate QR code as data URL
        const qrCode = await QRCode.toDataURL(uri, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300
        });

        return {
            qrCode,
            uri,
            params
        };
    }

    async processJob(input) {
        try {
            const params = this.parseInput(input);
            return await this.generateQRCode(params);
        } catch (error) {
            throw new Error(`Processing failed: ${error.message}`);
        }
    }
}

module.exports = EthereumQRService; 