const ERC20Token = artifacts.require("ERC20Token");
const MyCrowdSale = artifacts.require("MyCrowdSale");

module.exports = async deployer => {
  deployer.deploy(ERC20Token, 1000000).then(() => {
    return deployer.deploy(MyCrowdSale, 1, "0xf073c0fe3213a6670069d8a5a1019818C59263f6", ERC20Token.address);
  }); 
};