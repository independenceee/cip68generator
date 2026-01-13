import { MeshWallet } from "@meshsdk/core";
import { MeshTxBuilder } from "../txbuilders/mesh.txbuilder";
import { blockfrostProvider } from "../providers/blockfrost.provider";
import { APP_MNEMONIC, APP_NETWORK_ID } from "../constants/enviroments.constant";
import { DECIMAL_PLACE } from "../constants/common.constant";

describe("A multisig treasury is a shared fund where spending requires approval from at least m of n participants, with a predefined spending limit for security.", function () {
    let meshWallet: MeshWallet;

    // account 1 - addr_test1qz45qtdupp8g30lzzr684m8mc278s284cjvawna5ypwkvq7s8xszw9mgmwpxdyakl7dgpfmzywctzlsaghnqrl494wnqhgsy3g
    // account 2 - addr_test1qr39uar0u87xrmptw0f8ryx5mp3scvc3pkehp57yj5zhugxdgese6p77sy9hk0rqc5wqd6n8vmfyqq9f7sdfz9dm0azqzmmdew
    // account 3 - addr_test1qqy0z4ekhv8gcnmvkeakkaher82rlrx2yu9y79cjf4r704pqg73fhf002takqewlvjcy39dellyumg43f08uea0p6mps7pw77f
    // account 4 - addr_test1qrpfhvwrmq0y27k2elu0seh65w6kwyxxee6sq7f9d2ax62e8wm6fj2y63rp3kql4skhu2wyt0uml07w2pggzpzh95ugqk9j5d9
    // account 5 - addr_test1qpm9a92nk6grxwsxluqyjt9xd3cjcps90fjv8txm4spd6tv4mkujqpc7fzlvqu40kyvzh6fxmqp0578uk564ffqtfr7s9ppr9y

    beforeEach(async function () {
        meshWallet = new MeshWallet({
            accountIndex: 0,
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "mnemonic",
                words: "try brief control wink warfare jacket flush mean jar doctor elder mystery club session stereo another equal soup few alien nothing security stamp bullet"?.split(" ") || [],
            },
        });
    });

    jest.setTimeout(600000000);

   test("Deposit", async function () {
        // return;

        const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
            meshWallet: meshWallet,
        });

        const unsignedTx: string = await meshTxBuilder.deposit({
            name: "Aiken Course 2030",
            quantity: "10000000",
            receiver: "addr_test1qz45qtdupp8g30lzzr684m8mc278s284cjvawna5ypwkvq7s8xszw9mgmwpxdyakl7dgpfmzywctzlsaghnqrl494wnqhgsy3g",
            owners: [
                "addr_test1qz45qtdupp8g30lzzr684m8mc278s284cjvawna5ypwkvq7s8xszw9mgmwpxdyakl7dgpfmzywctzlsaghnqrl494wnqhgsy3g",
                "addr_test1qr39uar0u87xrmptw0f8ryx5mp3scvc3pkehp57yj5zhugxdgese6p77sy9hk0rqc5wqd6n8vmfyqq9f7sdfz9dm0azqzmmdew",
                "addr_test1qqy0z4ekhv8gcnmvkeakkaher82rlrx2yu9y79cjf4r704pqg73fhf002takqewlvjcy39dellyumg43f08uea0p6mps7pw77f",
                "addr_test1qrpfhvwrmq0y27k2elu0seh65w6kwyxxee6sq7f9d2ax62e8wm6fj2y63rp3kql4skhu2wyt0uml07w2pggzpzh95ugqk9j5d9",
                "addr_test1qpm9a92nk6grxwsxluqyjt9xd3cjcps90fjv8txm4spd6tv4mkujqpc7fzlvqu40kyvzh6fxmqp0578uk564ffqtfr7s9ppr9y",
            ],
        });

        const signedTx = await meshWallet.signTx(unsignedTx, true);
        const txHash = await meshWallet.submitTx(signedTx);
        await new Promise<void>(function (resolve) {
            blockfrostProvider.onTxConfirmed(txHash, () => {
                console.log("https://preview.cexplorer.io/tx/" + txHash);
                resolve();
            });
        });
    });

    // test("Signature", async function () {
    //     return;

    //     const meshTxBuilder: MeshTxBuilder = new MeshTxBuilder({
    //         meshWallet: meshWallet,
    //     });

    //     const unsignedTx: string = await meshTxBuilder.signature({
    //         name: "Aiken Course 2025",
    //     });

    //     const signedTx = await meshWallet.signTx(unsignedTx, true);
    //     const txHash = await meshWallet.submitTx(signedTx);
    //     await new Promise<void>(function (resolve) {
    //         blockfrostProvider.onTxConfirmed(txHash, () => {
    //             console.log("https://preview.cexplorer.io/tx/" + txHash);
    //             resolve();
    //         });
    //     });
    // });
});
