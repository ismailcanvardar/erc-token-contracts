pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract ERC777Token is ERC777 {
    constructor(
        uint256 initialSupply,
        address[] memory defaultOperators
    )
        ERC777("Token", "TKN", defaultOperators)
        public
    {
        _mint(msg.sender, msg.sender, initialSupply, "", "");
    }
}