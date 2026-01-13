import { BlockfrostProvider } from "@meshsdk/core";
import { BLOCKFROST_API_KEY } from "../constants/enviroments.constant";

export const blockfrostProvider = new BlockfrostProvider(BLOCKFROST_API_KEY);
