import { BrowserWallet, IFetcher, MeshTxBuilder, MeshWallet, UTxO } from "@meshsdk/core";

export class MeshAdapter {
    protected meshTxBuilder: MeshTxBuilder;
    protected wallet: BrowserWallet | MeshWallet;
    protected fetcher: IFetcher;

    constructor({
        meshTxBuilder,
        fetcher,
        wallet,
    }: {
        meshTxBuilder: MeshTxBuilder;
        fetcher: IFetcher;
        wallet: BrowserWallet | MeshWallet;
    }) {
        this.meshTxBuilder = meshTxBuilder;
        this.wallet = wallet;
        this.fetcher = fetcher;
    }

    protected getWalletForTx = async function () {
        const utxos = await this.wallet.getUtxos();
        const collateral = await this.wallet.getCollateral();
        const walletAddress = await this.wallet.getChangeAddress();

        if (!utxos || utxos?.length === 0) {
            throw new Error("No utxos found");
        }
        if (!collateral || collateral?.length === 0) {
            throw new Error("No collateral found");
        }
        if (!walletAddress) {
            throw new Error("No wallet address found");
        }

        return { utxos, collateral, walletAddress };
    };
}
