import { SuiClient } from '@mysten/sui/dist/cjs/client';
import express, { Request, Response } from 'express';
import { getBalances } from './Utility';
    
export const suiClient = new SuiClient({ url: "https://go.getblock.io/2e301c1cd2e542e897c7a14109d81baf" }); //getFullnodeUrl("mainnet")
export const OneCoinNineDecimals = 1000000000;


const app = express();
const port = 3000;

app.get('/getAddyStuffs', (req: Request, res: Response) => {
    const addy = req.query.addy as string;
    getBalances(addy).then(data => {
        res.send(data);
    })
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});