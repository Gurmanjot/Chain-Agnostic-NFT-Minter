import { useNetwork, useAccount, erc20ABI, useProvider, useSigner } from 'wagmi';
import { useEffect, useState } from 'react';
import { useAlert, positions } from 'react-alert';
import qs from 'qs';
import { ethers, utils } from "ethers";
import initiatemintabi from "../abis/initiatemintabi.json";
import mintnftabi from "../abis/mintnftabi.json";

function Swap() {

    const alert = useAlert()

    const { chain, chains } = useNetwork();
    const { isConnected, address } = useAccount();
    const { data: signer } = useSigner()

    const chainObj = {
        5: {
            chainId: 5,
            chianName: "Goerli",
            explorer: "https://goerli.etherscan.io/tx/",
            rpc: "https://goerli.infura.io/v3/",
            mintContract: "0x00ab6453080727d8ea658ff13e75becab8baecaf",
            domain: "ethereum-2"
        },
        80_001: {
            chainId: 80_001,
            chianName: "Mumbai",
            explorer: "https://mumbai.polygonscan.com/tx/",
            rpc: "https://matic-mumbai.chainstacklabs.com",
            mintContract: "0x77325bF80225B7FDc1D7AdF3451db5A04A0973BB",
            domain: "Polygon"
        },
        1_287: {
            chainId: 1_287,
            chianName: "Moonbase Alpha",
            explorer: "https://moonbase-blockscout.testnet.moonbeam.network/tx/",
            rpc: "https://rpc.testnet.moonbeam.network",
            mintContract: "0xd9554d04b0be5a145ad12b023b5a82cedf3f1782",
            domain: "Moonbeam"
        }
    } 

    async function mintNFT() {
        try{
            if(chain.id === 80_001) {
                const mintContract = new ethers.Contract(chainObj[chain.id].mintContract, mintnftabi, signer);
                const txn = await mintContract.initiateMint({ value: ethers.utils.parseUnits("700000", "gwei") });
                alert.success(
                    <div>
                        <div>Transaction Sent</div>
                        <button className='text-xs' onClick={()=> window.open(chainObj[chain.id].explorer + txn.hash, "_blank")}>View on explorer</button>
                    </div>, {
                    timeout: 0,
                    position: positions.BOTTOM_RIGHT
                });
            } else {
                const initiateMintContract = new ethers.Contract(chainObj[chain.id].mintContract, initiatemintabi, signer);
                const txn = await initiateMintContract.initiateMint(chainObj[80_001].domain, chainObj[80_001].mintContract, { value: ethers.utils.parseUnits("700000", "gwei") });
                alert.success(
                    <div>
                        <div>Transaction Sent</div>
                        <button className='text-xs' onClick={()=> window.open("https://testnet.axelarscan.io/gmp/" + txn.hash, "_blank")}>View on explorer</button>
                    </div>, {
                    timeout: 0,
                    position: positions.BOTTOM_RIGHT
                });
            }
        } catch(ex) {
            console.log(ex);
            alert.error(<div>Operation failed</div>, {
                timeout: 30000,
                position: positions.TOP_RIGHT
            });
        }
    }

    return (
        <div className="flex flex-1 items-center justify-start h-5/6 z-[10]">
        {
            isConnected && 
            <div className='rounded-md bg-black w-96 p-4 flex flex-col justify-center mt-96 ml-10'>
                <div className='text-white text-3xl font-bold'>Welcome to the Bored Ape Yacht Club</div>
                <button onClick={() => mintNFT()} className='mt-8 rounded-md bg-[#bfc500] p-2 font-semibold text-xl'>Mint</button>
            </div>
        }
        </div>
    )
}
export default Swap;