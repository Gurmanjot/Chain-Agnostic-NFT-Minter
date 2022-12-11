// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";

contract MintNFT is AxelarExecutable, ERC721 {

    uint private mintCost;
    uint public tokenCount;
    uint public maxSupply;
    address public owner;
    IAxelarGasService immutable gasReceiver;

    event Executed(address indexed _from, bytes _value);

    constructor(address _gateway, address _gasReceiver, uint _mintCost) AxelarExecutable(_gateway) ERC721("BoredApeYachtClub","BAYC") {
        tokenCount = 0;
        maxSupply = 9000;
        owner = msg.sender;
        mintCost = _mintCost;
        gasReceiver = IAxelarGasService(_gasReceiver);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        return string(abi.encodePacked("ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/",Strings.toString(tokenId)));
    }

    function increaseSupply(uint supply) public {
        require(msg.sender == owner, "Only owner can increase supply!!");
        maxSupply = supply;
    }

     // To receive the message from Axelar
    function _execute(
        string calldata,
        string calldata,
        bytes calldata payload
    ) internal override {

        address msgSender;

        (msgSender) = abi.decode(payload,(address));

        mintToken(msgSender);
        
        emit Executed(msg.sender, payload);
    }

    function mintToken(address _msgSender) private {
        tokenCount = tokenCount + 1;
        require(tokenCount <= maxSupply, "Max Supply Is Reached!!");
        super._mint(_msgSender,  tokenCount);
    }

    function initiateMint() public payable {
        require(msg.value > mintCost, "Pay the mint cost!!");
        mintToken(msg.sender);
    }

}