import "dotenv/config";

const env = {
    BLOCKFROST_API_KEY_PREPROD: process.env.BLOCKFROST_API_KEY_PREPROD!,
} as const;

export default env;
