// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MyDAO is Ownable {

    struct Proposal {
        bytes signature;
        address target;
        uint256 votesFor;
        uint256 votesAgainst;
        bool finished;
        uint256 endTimestamp;
    }
    
    uint256 quorum;
    uint256 period;
    mapping(address => mapping(uint256 => bool)) public voted;
    mapping(address => uint256) public deposited;
    mapping(uint256 => Proposal) public proposals;

    uint256 latestProposal = 0;
    
    constructor(uint256 _quorum, uint256 _period) {
        quorum = _quorum;
        period = _period;
    }

    function deposit() external payable {
        deposited[msg.sender] += msg.value;       
    }

    function addProposal(address _target, bytes memory _signature) external onlyOwner {
        proposals[latestProposal].endTimestamp = block.timestamp + period;
        proposals[latestProposal].target = _target;
        proposals[latestProposal++].signature = _signature;
    }

    function vote(uint256 _proposalId, bool _for) external {
        require(proposals[_proposalId].target != address(0), "Proposal doesn't exist");
        require(voted[msg.sender][_proposalId] == false, "Already voted");
        if (_for)
            proposals[_proposalId].votesFor += deposited[msg.sender];
        else 
            proposals[_proposalId].votesAgainst += deposited[msg.sender];
        voted[msg.sender][_proposalId] = true;
    }

    function finishProposal(uint256 _proposalId) external {
        require(proposals[_proposalId].votesFor * 100 /(proposals[_proposalId].votesFor + proposals[_proposalId].votesAgainst) >= quorum, "Quorum not passed");
        require(block.timestamp > proposals[_proposalId].endTimestamp, "Period not passed");
        require(proposals[_proposalId].finished == false, "Proposal already finished");
        proposals[_proposalId].finished = true;

        //if votesfor > votesAgainst
        (bool succ, ) = proposals[_proposalId].target.call{value: 0}(proposals[_proposalId].signature);
        require (succ, "Bad signature or target");
    }

 
}