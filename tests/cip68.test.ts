import { apiKey, apiUrl } from "../src/configs";
import { describe, test, expect, beforeEach } from "@jest/globals";
import {
    BlockfrostProvider,
    BrowserWallet,
    KoiosProvider,
    MeshTxBuilder,
    MeshWallet,
    metadataToCip68,
} from "@meshsdk/core";
import { Cip68Contract } from "../src";

describe("Mint, Burn, Update, Remove Assets (NFT/TOKEN) CIP68", function () {
    let meshTxBuilder: MeshTxBuilder;
    let wallet: BrowserWallet | MeshWallet;
    let blockfrostProvider: BlockfrostProvider | KoiosProvider;

    beforeEach(async function () {
        blockfrostProvider = new BlockfrostProvider("preprodHXZNMTECARQ3jlUE0RvCBT2qOK6JRtQf");
        wallet = new MeshWallet({
            networkId: 0,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "root",
                bech32: "xprv16zlhjxs29l9zk0aaf54ttn32nsrl9l855yqpsurnwjxfu2kd93dc4xx0pvxf0ffhzl9vc9vpcqsmmhhfu3c8nfusdj0yh8mg2kzgr797vxrtut4czgwjj4pdzfnstcwy6n0jfjw6tyeuqxdynl8msnu3cv8j5msy",
            },
        });

        meshTxBuilder = new MeshTxBuilder({
            fetcher: blockfrostProvider,
            evaluator: blockfrostProvider,
            submitter: blockfrostProvider,
        });
    });

    test("Mint", async function () {
        const cip68Contract = new Cip68Contract({
            fetcher: blockfrostProvider,
            wallet: wallet,
            meshTxBuilder: meshTxBuilder,
        });

        const unsignedTx = await cip68Contract.mint("Nguyen Duy Khanh", "1", {
            name: "ERC721",
            image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
            mediaType: "image/jpg",
            description: "Blockchain Developer",
        });
        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        expect(txHash.length).toBe(64);
    });

    test("Burn", async function () {
        const cip68Contract = new Cip68Contract({
            fetcher: blockfrostProvider,
            wallet: wallet,
            meshTxBuilder: meshTxBuilder,
        });
    });
});
