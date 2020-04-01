const CrowdFundingWithDeadline = artifacts.require('CrowdFundingWithDeadline');

module.exports = async (deployer) => {
  await deployer.deploy(CrowdFundingWithDeadline, 'Test campaign', 1, 200, '0x9bf1bA24ca1Bd3F41c4b1ddDc3B482bb2ea0eEa9');
};
