require('dotenv').config();
const { ethers, parseEther } = require('ethers');
const fs = require('fs');
const readline = require('readline');

// Load environment variables
const rpcUrl = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;

// Ensure environment variables are correctly set
if (!rpcUrl || !privateKey) {
    console.error("Please make sure RPC_URL and PRIVATE_KEY are set in the .env file.");
    process.exit(1);
}

// Set up the provider and wallet
const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);

// Function to read wallet addresses from a text file
function getWalletListFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return data.split('\n').map(line => line.trim()).filter(Boolean);
    } catch (error) {
        console.error(`Error reading the file: ${error.message}`);
        return [];
    }
}

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to get random wallet address
function getRandomWallet(walletList, fromAddress) {
    let randomWallet;
    do {
        randomWallet = walletList[Math.floor(Math.random() * walletList.length)];
    } while (randomWallet.toLowerCase() === fromAddress.toLowerCase());
    return randomWallet;
}

// Function to transfer AVAX
async function transferRandomAVAX(walletList, totalTasks) {
    const fromAddress = await wallet.getAddress();

    for (let taskCount = 1; taskCount <= totalTasks; taskCount++) {
        const toAddress = getRandomWallet(walletList, fromAddress);

    // Generate a random amount between 0.05 and 0.06 AVAX
    const amountInAVAX = (Math.random() * (0.06 - 0.05) + 0.05).toFixed(4);
    const amountInWei = parseEther(amountInAVAX.toString());


        try {
            // Build and send the transaction
            const tx = await wallet.sendTransaction({
                to: toAddress,
                value: amountInWei
            });

            // Log the transaction hash immediately after sending the transaction
            console.log(`[${taskCount}] Transaction sent. Tx Hash: ${tx.hash}`);
            console.log(`Transferred ${amountInAVAX} AVAX from ${fromAddress} to ${toAddress}.`);

            // Wait for the transaction to be mined and get the receipt
            //const receipt = await tx.wait();

            //console.log(receipt);
            
        } catch (error) {
            console.error(`Error transferring to ${toAddress}:`, error);
        }

        // Wait for 10 seconds before processing the next transaction
        await delay(5000); // 5 seconds delay
    }

    console.log('All tasks completed.');
}

// Define the path to your wallet list text file
const walletListFilePath = 'wallets.txt';
const walletList = getWalletListFromFile(walletListFilePath);

// Check if wallet list is not empty
if (walletList.length > 0) {
    // Create a readline interface for user input
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Ask the user for the total number of tasks
    rl.question('Enter the total number of tasks to complete: ', (answer) => {
        const totalTasks = parseInt(answer);

        if (isNaN(totalTasks) || totalTasks <= 0) {
            console.log('Please enter a valid positive number for total tasks.');
        } else {
            // Start the transfer process
            transferRandomAVAX(walletList, totalTasks);
        }

        // Close the readline interface
        rl.close();
    });
} else {
    console.log('No valid wallet addresses found in the file.');
}
