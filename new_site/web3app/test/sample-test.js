import { expect } from "chai";
import pkg from 'hardhat';
const { ethers } = pkg;

describe("MyNFT", function () {
    it("Should mint and transfer an NFT to someone", async function() {
        const MyTutorial = await ethers.getContractFactory("MyTutorial");
        const mytutorial = await MyTutorial.deploy();
        await mytutorial.deployed();

        const recipient = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
        const metadataURI = 'cid/test.png';

        let balance = await mytutorial.balanceOf(recipient);
        expect(balance).to.equal(0);

        const newlyMintedToken = await mytutorial.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.05') });

        // wait until the transaction is mined
        await newlyMintedToken.wait();

        balance = await mytutorial.balanceOf(recipient);
        expect(balance).to.equal(1);

        expect(await mytutorial.isContentOwned(metadataURI)).to.equal(true);
    });
});