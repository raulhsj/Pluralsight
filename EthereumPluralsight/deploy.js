/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

const sender = '0x6a65f5496479b9f9748bcb9748c98e43488682fb';

const web3 = createWeb3();
const contract = compileContract();

deployContract(web3, contract, sender)
  .then(() => {
    console.log('Deployment finished');
  })
  .catch((error) => {
    console.log(`Failed to deploy contract: ${error}`);
  });

function compileContract() {
  const compilerInput = {
    Voter: fs.readFileSync('Voter.sol', 'utf8'),
  };

  console.log('Compiling the contract');

  // Compile and optimize the contract
  const compiledContract = solc.compile({ sources: compilerInput }, 1);

  // Get compiled contract
  const contractLocal = compiledContract.contracts['Voter:Voter'];

  // Save contract's ABI
  const abi = contractLocal.interface;
  fs.writeFileSync('abi.json', abi);

  return contractLocal;
}

function createWeb3() {
  const web3Local = new Web3();
  web3Local.setProvider(new web3Local.providers.HttpProvider('http://localhost:8545'));
  // Unlock account always
  web3Local.eth.personal.unlockAccount(sender, '123', 5000);
  return web3Local;
}

async function deployContract(web3, contract, sender) {
  const Voter = new web3.eth.Contract(JSON.parse(contract.interface));
  const bytecode = `0x${contract.bytecode}`;
  const gasEstimate = await web3.eth.estimateGas({ data: bytecode });

  console.log('Deploying the contract');

  const contractInstance = await Voter.deploy({ data: bytecode }).send({
    from: sender,
    gas: gasEstimate,
  })
    .on('transactionHash', (transactionHash) => {
      console.log(`Transaction hash: ${transactionHash}`);
    })
    .on('confirmation', (confirmationNumber) => {
      console.log(`Confirmation number: ${confirmationNumber}`);
    });

  console.log(`Contract address: ${contractInstance.options.address}`);
}
