import { applyParamsToScript } from "@meshsdk/core-csl";
import { ICip68Contract } from "../interfaces/cip68.interface";
import { MeshAdapter } from "../adapters/mesh.adapter";
import {
    MeshTxBuilder,
    resolveScriptHash,
    CIP68_100,
    CIP68_222,
    stringToHex,
    mConStr0,
    mConStr2,
    serializePlutusScript,
    PlutusScript,
    metadataToCip68,
} from "@meshsdk/core";
import { readValidator } from "../utils";
import { title } from "../configs";

export class Cip68Contract extends MeshAdapter implements ICip68Contract {
    mint = async function (tokenName: string, quantity: string, metadata: any): Promise<string> {
        const { walletAddress, utxos, collateral } = await this.getWalletForTx();
        const mintCompileCode: string = readValidator(title.mint);
        const storeCompileCode: string = readValidator(title.store);
        const mintScriptCbor = applyParamsToScript(mintCompileCode, []);
        const storeScriptCbor = applyParamsToScript(storeCompileCode, []);

        const mintScript: PlutusScript = { code: mintScriptCbor, version: "V3" };
        const storeScript: PlutusScript = { code: storeScriptCbor, version: "V3" };
        const policyId = resolveScriptHash(mintScriptCbor, "V3");
        const storeAddress = serializePlutusScript(storeScript).address;

        const unsignedTx = await this.meshTxBuilder
            .txIn(
                utxos[0].input.txHash,
                utxos[0].input.outputIndex,
                utxos[0].output.amount,
                utxos[0].output.address,
            )

            .mintPlutusScriptV3()
            .mint("1", policyId, CIP68_100(stringToHex(tokenName)))
            .mintingScript(mintScriptCbor)
            .mintRedeemerValue(mConStr0([]))

            .mintPlutusScriptV3()
            .mint(String(quantity), policyId, CIP68_222(stringToHex(tokenName)))
            .mintingScript(mintScriptCbor)
            .mintRedeemerValue(mConStr0([]))

            .txOut(storeAddress, [
                { unit: policyId + CIP68_100(stringToHex(tokenName)), quantity: "1" },
            ])
            .txOutInlineDatumValue(metadataToCip68(metadata))
            .changeAddress(walletAddress)
            .selectUtxosFrom(utxos)
            .txInCollateral(
                collateral[0].input.txHash,
                collateral[0].input.outputIndex,
                collateral[0].output.amount,
                collateral[0].output.address,
            )
            .complete();

        return unsignedTx;
    };
    burn = async function (tokenName: string, txHash: string): Promise<string> {
        const { walletAddress, utxos, collateral } = await this.getWalletForTx();

        const mintCompileCode: string = readValidator(title.mint);
        const storeCompileCode: string = readValidator(title.store);
        const mintScriptCbor = applyParamsToScript(mintCompileCode, []);
        const storeScriptCbor = applyParamsToScript(storeCompileCode, []);

        const mintScript: PlutusScript = { code: mintScriptCbor, version: "V3" };
        const storeScript: PlutusScript = { code: storeScriptCbor, version: "V3" };
        const policyId = resolveScriptHash(mintScriptCbor, "V3");
        const storeAddress = serializePlutusScript(storeScript).address;

        const unsignedTx = await this.meshTxBuilder
            .txIn(
                utxos[0].input.txHash,
                utxos[0].input.outputIndex,
                utxos[0].output.amount,
                utxos[0].output.address,
            )
            .spendingPlutusScriptV3()
            .spendingReferenceTxInInlineDatumPresent()
            .spendingReferenceTxInRedeemerValue(mConStr2([]))
            .txInScript(storeScript)

            .mintPlutusScriptV3()
            .mint("-1", policyId, CIP68_100(stringToHex(tokenName)))
            .mintingScript(mintScriptCbor)
            .mintRedeemerValue(mConStr0([]))

            .mintPlutusScriptV3()
            .mint("-1", policyId, CIP68_222(stringToHex(tokenName)))
            .mintingScript(mintScriptCbor)
            .mintRedeemerValue(mConStr0([]))

            .txOut(storeAddress, [
                { unit: policyId + CIP68_100(stringToHex(tokenName)), quantity: "1" },
            ])

            .changeAddress(walletAddress)
            .selectUtxosFrom(utxos)
            .txInCollateral(
                collateral[0].input.txHash,
                collateral[0].input.outputIndex,
                collateral[0].output.amount,
                collateral[0].output.address,
            )
            .complete();

        return unsignedTx;
    };
    update: () => Promise<string>;
    remove: () => Promise<string>;
}
