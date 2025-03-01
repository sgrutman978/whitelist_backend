import { OneCoinNineDecimals, suiClient } from "./index";
    const mapOfCoinTypes = new Map<string, string>();
    const mapOfNFTTypes = new Map<string, string>();

    mapOfCoinTypes.set("Axol", "0xae00e078a46616bf6e1e6fb673d18dcd2aa31319a07c9bc92f6063363f597b4e::AXOL::AXOL");
    mapOfCoinTypes.set("Blub", "0xfa7ac3951fdca92c5200d468d31a365eb03b2be9936fde615e69f0c1274ad3a0::BLUB::BLUB");
    mapOfCoinTypes.set("Goon", "0xc31be4b73d3352373c9e2d99e8620944f414b24407495b1d0c9f5628e2e86104::goon::GOON");

    mapOfNFTTypes.set("Hero NFT", "0x8ebad5259b2e2de6f396fcb7e3e1d9d292337234ee898824e70a392b017acc6e::nft::Hero");
    mapOfNFTTypes.set("Chill Cats", "0x3706895940d5a19a93f8656c0bd506ce7b5999d8e9af292d4fe1cd5ae0c2a279::chillcats_collection::ChillCats");
    mapOfNFTTypes.set("DSL Legacy NFT", "0xff3923e6261d2f979bd5db60929ede5680b41b98d58a419281f1302058e38845::bluemove_launchpad::DSL_Legacy");
    mapOfNFTTypes.set("Killa Club NFT", "0xc4f793bda2ce1db8a0626b5d3e189680bf7b17559bfe8389cd9db10d4e4d61dc::nft::KillaClubNFT");
    mapOfNFTTypes.set("AfEgg NFT", "0x484932c474bf09f002b82e4a57206a6658a0ca6dbdb15896808dcd1929c77820::egg::AfEgg");
    mapOfNFTTypes.set("Kumo NFT", "0x57191e5e5c41166b90a4b7811ad3ec7963708aa537a8438c1761a5d33e2155fd::kumo::Kumo");
    mapOfNFTTypes.set("Prime NFT", "0x034c162f6b594cb5a1805264dd01ca5d80ce3eca6522e6ee37fd9ebfb9d3ddca::factory::PrimeMachin");


export async function getBalances(addy: string): Promise<Map<string, number>>{
        let mapOfAmounts: Map<string, number> = new Map();
        // if(currentAccount){
            console.log("Getting balances");
          suiClient.getBalance({ owner: addy }).then((res) => {
  //          console.log(res.totalBalance);
            const b = Math.floor((parseInt(res.totalBalance)/OneCoinNineDecimals)*10000)/10000;
            mapOfAmounts.set("Sui", b);
          });
          mapOfCoinTypes.forEach((val, key) => {
          suiClient.getBalance({ owner: addy, coinType: val }).then((res) => {
    //        console.log(res.totalBalance);
            const b = Math.floor((parseInt(res.totalBalance)/OneCoinNineDecimals)*10000)/10000;
            if(b > 0){
                mapOfAmounts.set(key, b);
            }
          });
        });
        let nfts: any[] = [];
        let lastCursor: string | undefined | null = null;
        let hasCursor = true;
        while(hasCursor){
      //      console.log(nfts);
            let someObjs: any = await suiClient.getOwnedObjects({
                owner: addy,
                cursor: lastCursor,
            });
         //   console.log(someObjs);
        //    console.log(someObjs.data[1].data.type)
            nfts.push(...someObjs.data);
            lastCursor = someObjs.nextCursor;
            hasCursor = someObjs.hasNextPage;
        }
       // console.log(nfts);
       // console.log(mapOfAmounts);
        for (const obj of nfts) {
         //   console.log(obj);
            const objectDetails = await suiClient.getObject({
              id: obj.data?.objectId!,
              options: { showType: true },
            });
            const objectType = objectDetails.data?.type;
            mapOfNFTTypes.forEach((val, key) => {
           //     console.log(val);
             //   console.log(objectType);
            if (objectType === val) {
                mapOfAmounts.set(key, (mapOfAmounts.has(key) ? mapOfAmounts.get(key)! : 0)+1);
            }
        });
    }
    console.log(mapOfAmounts);
    return mapOfAmounts;
}
