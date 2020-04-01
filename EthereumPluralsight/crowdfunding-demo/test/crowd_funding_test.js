const CrowdFundingWithDeadline = artifacts.require('TestCrowdFundingWithDeadline');
const BigNumber = require('bignumber.js')

contract('CrowdFundingWithDeadline', (accounts) => {
  let contract;
  const [contractCreator] = accounts;
  const [beneficiary] = accounts;

  const ONE_ETH = new BigNumber(1000000000000000000);

  const ONGOING_STATE = 0;
  const ERROR_MSG = 'Returned error: VM Exception while processing transaction: revert';
  const FAILED_STATE = 1;
  const SUCCEEDED_STATE = 2;
  const PAID_OUT_STATE = 3;

  beforeEach(async () => {
    console.log(accounts);
    contract = await CrowdFundingWithDeadline.new('funding', 1, 10, beneficiary, {
      from: contractCreator,
      gas: 2000000,
    });
  });

  it('contract is initialized', async () => {
    const campaignName = await contract.name.call();
    expect(campaignName).to.equal('funding');

    const targetAmount = await contract.targetAmount.call();
    expect(ONE_ETH.isEqualTo(targetAmount)).to.equal(true);

    const fundingDeadline = await contract.fundingDeadline.call();
    expect(fundingDeadline.toNumber()).to.equal(600);

    const actualBeneficiary = await contract.beneficiary.call();
    expect(actualBeneficiary).to.equal(beneficiary);

    const state = await contract.state.call();
    expect(state.valueOf().toNumber()).to.equal(ONGOING_STATE);
  });

  it('funds are contributed', async () => {
    await contract.contribute({
      value: ONE_ETH,
      from: contractCreator,
    });

    const contributed = await contract.amounts.call(contractCreator);
    expect(ONE_ETH.isEqualTo(contributed)).to.equal(true);

    const totalCollected = await contract.totalCollected.call();
    expect(ONE_ETH.isEqualTo(totalCollected)).to.equal(true);
  });

  it('cannot contribute after deadline', async () => {
    try {
      await contract.setCurrentTime(601);
      await contract.sendTransaction({
        value: ONE_ETH,
        from: contractCreator,
      });
      expect.fail();
    } catch (error) {
      expect(error.message).to.equal(ERROR_MSG);
    }
  });

  it('crowfunding suceeded', async () => {
    await contract.contribute({
      value: ONE_ETH,
      from: contractCreator,
    });
    await contract.setCurrentTime(601);
    await contract.finishCrowdFunding();
    const state = await contract.state.call();

    expect(state.valueOf().toNumber()).to.equal(SUCCEEDED_STATE);
  });

  it('crowfunding failed', async () => {
    await contract.setCurrentTime(601);
    await contract.finishCrowdFunding();
    const state = await contract.state.call();

    expect(state.valueOf().toNumber()).to.equal(FAILED_STATE);
  });

  it('collected money paid out', async () => {
    await contract.contribute({
      value: ONE_ETH,
      from: contractCreator,
    });
    await contract.setCurrentTime(601);
    await contract.finishCrowdFunding();

    const initAmount = await web3.eth.getBalance(beneficiary);
    console.log(initAmount);
    await contract.collect({
      from: contractCreator,
    });

    const newBalance = await web3.eth.getBalance(beneficiary);
    console.log(newBalance);
    const difference = newBalance - initAmount;
    expect(ONE_ETH.isEqualTo(difference)).to.equal(true);

    const fundingState = await contract.state.call();
    expect(fundingState.valueOf().toNumber()).to.equal(PAID_OUT_STATE);
  });

  it('withdraw funds from the contract', async() => {
    await contract.contribute({
      value: ONE_ETH - 100,
      from: contractCreator,
    });
    await contract.setCurrentTime(601);
    await contract.finishCrowdFunding();

    await contract.withdraw({
      from: contractCreator,
    });

    const amount = await contract.amounts.call(contractCreator);
    expect(amount.toNumber()).to.equal(0);
  });

  it('event is emitted', async() => {
    await contract.setCurrentTime(601);
    const transaction = await contract.finishCrowdFunding();

    const events = transaction.logs
    expect(events.length).to.equal(1);

    const event = events[0]
    expect(event.args.totalCollected.toNumber()).to.equal(0);
    expect(event.args.succeeded).to.equal(false);
  });
});
