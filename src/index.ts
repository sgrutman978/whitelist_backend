import { SuiClient } from '@mysten/sui/client';
import express, { Request, Response } from 'express';
import { getBalances } from './Utility';
   
import cors from 'cors';


export const suiClient = new SuiClient({ url: "https://go.getblock.io/2e301c1cd2e542e897c7a14109d81baf" }); //getFullnodeUrl("mainnet")
export const OneCoinNineDecimals = 1000000000;


const app = express();
const port = 3006;
app.use(cors())

app.get('/getAddyStuffs', (req: Request, res: Response) => {
    const addy = req.query.addy as string;
    getBalances(addy).then(data => {
            let json = JSON.stringify(Object.fromEntries(data));
	    console.log(json);
	    res.send(json);
    })
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
