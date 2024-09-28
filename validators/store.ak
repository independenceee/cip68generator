use cardano/assets.{without_lovelace}
use cardano/transaction.{Input,
  Output, OutputReference, Transaction, find_input}
use cip68generator/types.{Redeem, Remove, StoreRedeemer, Update}
use cip68generator/utils.{check_output_utxo}
use types/cip68.{CIP68}
use validation/find.{output_by_addr_value, output_by_value}

validator store {
  spend(
    _datum: Option<CIP68>,
    redeemer: StoreRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    when redeemer is {
      Update -> True
      Remove -> True
      Redeem -> True
    }
  }

  else(_) {
    fail
  }
}
