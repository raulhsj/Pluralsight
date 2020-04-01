const Utils = artifacts.require('Utils');
const CrowdFundingWithDeadline = artifacts.require('CrowdFundingWithDeadline');
const TestCrowdFundingWithDeadline = artifacts.require('TestCrowdFundingWithDeadline');

module.exports = async (deployer) => {
  await deployer.deploy(Utils);
  deployer.link(Utils, CrowdFundingWithDeadline);
  deployer.link(Utils, TestCrowdFundingWithDeadline);
};
