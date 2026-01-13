import { MeshAdapter } from "../adapters/mesh.adapter";
import { APP_NETWORK } from "../constants/enviroments.constant";
import { deserializeAddress, mPubKeyAddress, mConStr0, mConStr1, mConStr2, stringToHex, list } from "@meshsdk/core";

export class MeshTxBuilder extends MeshAdapter {
    deposit = async ({
        quantity,
        receiver,
        name,
        owners,
    }: {
        name: string;
        quantity: string;
        receiver?: string;
        owners?: string[];
        signers?: string[];
    }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const utxo = await this.getAddressUTXOAsset(this.spendAddress, this.policyId + stringToHex(name));

        const unsignedTx = this.meshTxBuilder;

        if (utxo) {
            // const datum = this.convertDatum({ plutusData: utxo.output.plutusData as string });
            unsignedTx
                .spendingPlutusScriptV3()
                .txIn(utxo.input.txHash, utxo.input.outputIndex)
                .txInInlineDatumPresent()
                .txInRedeemerValue(mConStr0([]))
                .txInScript(this.spendScriptCbor)

                .txOut(this.spendAddress, [
                    { unit: this.policyId + stringToHex(name), quantity: "1" },
                    {
                        unit: "lovelace",
                        quantity: String(
                            utxo.output.amount.reduce((total, asset) => {
                                if (asset.unit === "lovelace") {
                                    return total + Number(asset.quantity);
                                }
                                return total;
                            }, Number(quantity)),
                        ),
                    },
                ])
                .txOutInlineDatumValue(
                    mConStr0([
                        mPubKeyAddress(deserializeAddress(receiver!).pubKeyHash, deserializeAddress(receiver!).stakeCredentialHash),
                        mConStr0(
                            owners!.map((owner) =>
                                mPubKeyAddress(deserializeAddress(owner).pubKeyHash, deserializeAddress(owner).stakeCredentialHash),
                            ),
                        ),
                        mConStr0(
                            owners!.map((owner) =>
                                mPubKeyAddress(deserializeAddress(owner).pubKeyHash, deserializeAddress(owner).stakeCredentialHash),
                            ),
                        ),
                    ]),
                );
        } else {
            unsignedTx
                .mintPlutusScriptV3()
                .mint("1", this.policyId, stringToHex(name))
                .mintingScript(this.mintScriptCbor)
                .mintRedeemerValue(mConStr0([]))

                .txOut(this.spendAddress, [
                    {
                        unit: this.policyId + stringToHex(name),
                        quantity: "1",
                    },
                    {
                        unit: "lovelace",
                        quantity: quantity,
                    },
                ])
                .txOutInlineDatumValue(
                    mConStr0([
                        mPubKeyAddress(deserializeAddress(receiver!).pubKeyHash, deserializeAddress(receiver!).stakeCredentialHash),
                        mConStr0(
                            owners!.map((owner) =>
                                mPubKeyAddress(deserializeAddress(owner).pubKeyHash, deserializeAddress(owner).stakeCredentialHash),
                            ),
                        ),
                        mConStr0(
                            owners!.map((owner) =>
                                mPubKeyAddress(deserializeAddress(owner).pubKeyHash, deserializeAddress(owner).stakeCredentialHash),
                            ),
                        ),
                    ]),
                );
        }
        unsignedTx
            .selectUtxosFrom(utxos)
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };
}
