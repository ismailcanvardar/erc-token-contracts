const MyCrowdsale = artifacts.require("./MyCrowdsale.sol");
const ERC20Token = artifacts.require("./ERC20Token.sol");

const BigNumber = web3.BigNumber;

contract("Crowdsale", async ([wallet, investor1, investor2]) => {
  // Token's part
  let initialSupply = 1000000;

  // Crowdsale's part
  let rate = 1;
  let token = ERC20Token.address;

  let tokenInstance = await ERC20Token.deployed();
  let crowdsaleInstance = await MyCrowdsale.deployed();

  describe("crowdsale", () => {
    it("tracks the rate", async () => {
      const rateValue = await crowdsaleInstance.rate.call();
      assert.equal(rateValue, rate, "should equal");
    });

    it("tracks the wallet", async () => {
      const walletValue = await crowdsaleInstance.wallet.call();
      assert.equal(walletValue, wallet, "should equal");
    });

    it("tracks the token", async () => {
      const tokenValue = await crowdsaleInstance.token.call();
      assert.equal(tokenValue, token, "should equal");
    });
  });
});
