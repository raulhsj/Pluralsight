/* eslint-disable no-use-before-define */
const fs = require('fs');
const Web3 = require('web3');
// const Voter = require('./truffle-demo/build/contracts/Voter');

const web3 = new Web3();

const contractAddress = '0x81965270A8866f660A93b188Fe4D58D4f5dDe60f';
// Geth
// const fromAddress = '0x6a65f5496479b9f9748bcb9748c98e43488682fb';

// Ganache
const fromAddress = '0x9bf1bA24ca1Bd3F41c4b1ddDc3B482bb2ea0eEa9';

// Connect to Ganache network
web3.setProvider(new web3.providers.HttpProvider('http://localhost:7545'));

// Connect to Geth CLI
// web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// Unlock account always (only used with geth)
// web3.eth.personal.unlockAccount(fromAddress, '123', 5000);

// Use only with solc library
const abiStr = fs.readFileSync('abi.json', 'utf8');
const abi = JSON.parse(abiStr);

// With truffle compilation
// const { abi } = Voter;
const voter = new web3.eth.Contract(abi, contractAddress);

sendTransactions()
  .then(() => {
    console.log('Done');
  })
  .catch((error) => {
    console.log(error);
  });

async function sendTransactions() {
  console.log('Adding option \'coffee\'');
  await voter.methods.addOption('coffee').send({ from: fromAddress });

  console.log('Adding option \'tea\'');
  await voter.methods.addOption('tea').send({ from: fromAddress });

  await voter.methods.startVoting().send({ from: fromAddress, gas: 600000 });

  console.log('Voting');
  // await voter.methods['vote(uint256)'](0).send({ from: fromAddress, gas: 600000 });
  await voter.voteUint(0).send({ from: fromAddress, gas: 600000 });

  console.log('Getting votes');
  const votes = await voter.methods.getVotes().call({ from: fromAddress });

  console.log(`Votes: ${votes}`);
}
