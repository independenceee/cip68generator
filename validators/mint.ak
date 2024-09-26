use cip68generator/types.{MintRedeemer, Mint, Burn}
use cardano/assets.{PolicyId}

validator mint {
    mint(redeemer: MintRedeemer, policy_id: PolicyId, transaction: Transaction) -> Bool {
        when redeemer is {
            Mint -> True
            Burn -> True
        }
    }
}