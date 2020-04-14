const ERC20Token = artifacts.require("ERC20Token");
const CrowdSale = artifacts.require("CrowdSale");

module.exports = async deployer => {
  deployer.deploy(ERC20Token, 1000000).then(() => {
    deployer.deploy(CrowdSale, 1, "CFC29313EF0AE1A50BBD4956C673ED5188835D55A23A0235A1A497DEC15E68EF", ERC20Token.address);
  }); 
};