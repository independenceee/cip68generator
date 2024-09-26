import { BrowserWallet, IFetcher, MeshTxBuilder, MeshWallet } from "@meshsdk/core";

export class MeshAdapter {
    meshTxBuilder: MeshTxBuilder;
    wallet?: BrowserWallet | MeshWallet;
    fetcher?: IFetcher;
    stakeCredential?: string;
    networkId?: number;
    version?: number;

    constructor({
        meshTxBuilder,
        fetcher,
        version,
        networkId,
    }: {
        meshTxBuilder: MeshTxBuilder;
        fetcher: IFetcher;
        version?: number;
        networkId?: number;
        wallet?: BrowserWallet | MeshWallet;
        stakeCredential?: string;
    }) {
        this.meshTxBuilder = meshTxBuilder;
    }
}
