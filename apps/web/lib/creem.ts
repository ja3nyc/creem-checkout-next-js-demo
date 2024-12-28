import { CreemSDK } from '@creem/sdk';

export const creem = new CreemSDK({
    apiKey: process.env.CREEM_API_KEY!
}); 