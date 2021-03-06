pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";

contract MyCrowdsale is Crowdsale {
    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token
    )
        Crowdsale(rate, wallet, token)
        public
    {

    }
}