import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";


describe("Greeter", function () {
  let dao: Contract
  let test: Contract
  let owner: SignerWithAddress

  before("initialization", async function () {
    [owner] = await ethers.getSigners()

    // We get the contract to deploy
    const MyDAO = await ethers.getContractFactory("MyDAO");
    dao = await MyDAO.deploy(50, 0);
  
    await dao.deployed();
  
    console.log("Dao deployed to:", dao.address);
  
    const TEST = await ethers.getContractFactory("MyTest");
    test = await TEST.deploy();
  
    await test.deployed();
  });

  it("MyDAO tests", async() => {
    await dao.deposit({value: "1000000000000000000"})

    console.log((await dao.deposited(await owner.getAddress())).toString());
    
    await dao.addProposal(test.address, "0x78ea60ce0000000000000000000000000000000000000000000000000000000000000001")
    await dao.addProposal(test.address, "0x78ea60ce0000000000000000000000000000000000000000000000000000000000000001")

    await dao.vote(0, true)
    await dao.vote(1, false)

    await expect(dao.vote(0, true)).to.be.reverted; 
    await expect(dao.vote(9, true)).to.be.reverted; 

    await dao.finishProposal(0)
    await expect(dao.finishProposal(0)).to.be.reverted;

    console.log(await test.solved());
    
    const MyDAO = await ethers.getContractFactory("MyDAO");
    dao = await MyDAO.deploy(50, 100);
    await dao.deployed();
    await dao.addProposal(test.address, "0x78ea60ce0000000000000000000000000000000000000000000000000000000000000001")
    await dao.vote(0, true)
    await expect(dao.finishProposal(0)).to.be.reverted

  })
  
});


