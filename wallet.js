require('dotenv').config();
const { ethers } = require('ethers');
const { HDNode } = require('@ethersproject/hdnode'); // Correct import for HDNode

// Seed phrase stored in the .env file
const seedPhrase = process.env.SEED_PHRASE;

// Number of addresses to derive from the seed phrase
const numberOfAddresses = 20;

// Function to derive wallets from the seed phrase
function getWalletsFromSeed(seedPhrase, numberOfAddresses) {
    const hdNode = HDNode.fromMnemonic(seedPhrase); // Use HDNode from '@ethersproject/hdnode'

    let wallets = [];
    for (let i = 0; i < numberOfAddresses; i++) {
        // Derive a wallet for each index in the HD path
        const wallet = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
        wallets.push({
            address: wallet.address,
            privateKey: wallet.privateKey
        });
    }
    return wallets;
}

// Get the wallet list from the seed phrase
const wallets = getWalletsFromSeed(seedPhrase, numberOfAddresses);

// Display the derived wallet addresses and private keys
wallets.forEach((wallet, index) => {
    console.log(`Wallet ${index + 1}:`);
    console.log(`  Address: ${wallet.address}`);
    console.log(`  Private Key: ${wallet.privateKey}`);
    console.log('----------------------------------');
});