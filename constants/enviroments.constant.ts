import { Network } from "@meshsdk/core";

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || "";
const KOIOS_TOKEN = process.env.KOIOS_TOKEN || "";
const APP_NETWORK: Network = (process.env.NEXT_PUBLIC_APP_NETWORK?.toLowerCase() as Network) || "preview";
const APP_NETWORK_ID = APP_NETWORK === "mainnet" ? 1 : 0;
const APP_MNEMONIC = process.env.APP_MNEMONIC || "";

export { APP_NETWORK, APP_NETWORK_ID, BLOCKFROST_API_KEY, KOIOS_TOKEN, APP_MNEMONIC };
