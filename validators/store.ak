use aiken/collection/list
use cardano/assets.{without_lovelace}
use cardano/transaction.{Input,
  Output, OutputReference, Transaction, find_input}
use cip68generator/types.{Redeem, Remove, StoreDatum, StoreRedeemer, Update}
use cip68generator/utils.{check_output_utxo}
use validation/find.{output_by_addr_value, output_by_value}

validator store {
  spend(
    datum: Option<StoreDatum>,
    redeemer: StoreRedeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(datum) = datum
    let Transaction { extra_signatories, inputs, outputs, .. } = transaction
    expect Some(input) = find_input(inputs, output_reference)
    let reference_nft = input.output.value |> without_lovelace()
    let has_signed = list.has(extra_signatories, datum.extra.address)
    when datum.extra.has_change is {
      True ->
        when redeemer is {
          Update -> {
            let validation_output =
              output_by_addr_value(outputs, input.output.address, reference_nft)
            and {
              has_signed?,
              check_output_utxo(validation_output)?,
            }
          }

          Remove -> {
            let validation_output = output_by_value(outputs, reference_nft)
            and {
              check_output_utxo(validation_output)?,
              has_signed?,
            }
          }
          Redeem -> has_signed
        }
      False -> False
    }
  }

  else(_) {
    fail
  }
}
