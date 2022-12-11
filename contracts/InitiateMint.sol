// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executables/AxelarExecutable.sol";

contract InitiateMint is AxelarExecutable {

    IAxelarGasService immutable gasReceiver;
    uint private mintCost;

    event Executed(address indexed _from, bytes _value);

    constructor(address _gateway, address _gasReceiver, uint _mintCost) AxelarExecutable(_gateway) {
        gasReceiver = IAxelarGasService(_gasReceiver);
        mintCost = _mintCost;
    }

    // To send message to Axelar
    function sendMessage(
        string calldata destinationChain,
        string calldata destinationAddress,
        bytes memory payload
    ) private {
        if (msg.value > 0) {
            gasReceiver.payNativeGasForContractCall{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    function initiateMint (string calldata destinationChain, string calldata destinationAddress) public payable {
        require(msg.value > mintCost, "Pay the mint cost!!");
        
        bytes memory message = abi.encode(msg.sender);

        sendMessage(destinationChain, destinationAddress, message);
    }

}