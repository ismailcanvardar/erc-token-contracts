pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract Token is ERC20, ERC20Detailed {
    constructor(uint256 initialSupply) ERC20Detailed("Token", "TKN", 18) public {
        _mint(msg.sender, initialSupply);
    }
}