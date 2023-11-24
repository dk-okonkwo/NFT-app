import { ethers } from "ethers";
import WalletBalance from "./WalletBalance";
import { useEffect, useState } from "react";
import MyTutorial from "../artifacts/contracts/MyNFT.sol/MyTutorial.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, MyTutorial.abi, signer);

function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {
    const count = await contract.count();
    setTotalMinted(parseInt(count));
  };

  return (
    <div>
      <WalletBalance />

      <h1>My Tutorial NFT Collection</h1>
      {Array(totalMinted + 1)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            <NFTImage tokenId={i} />
          </div>
        ))}
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
  const contentId = "QmYVFZjRcZCUkDqhtp3d5ohpKvuYriQeYYJUgZemJopBsc";
  const metadataURI = `${contentId}/${tokenId}.json`;
  const imageURI = `./images/nft.jpg`;

  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });

    await result.wait();
    getMintedStatus();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
  }

  return (
    <div>
      <img src={isMinted ? imageURI : "./src/components/mystery.jpg"}></img>
      <div>
        <h5>ID #{tokenId}</h5>
        {!isMinted ? (
          <button onClick={mintToken}>Mint</button>
        ) : (
          <button onClick={getURI}>Taken! Show URI</button>
        )}
      </div>
      <div>
        <img src="" alt="test source" />
      </div>
    </div>
  );
}

export default Home;
