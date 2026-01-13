use aiken/collection/list
use cardano/assets.{PolicyId, lovelace_of, without_lovelace}
use cardano/transaction.{InlineDatum, OutputReference, Transaction, find_input}
use cardano/tx.{verify_signature}
use cocktail/vodka_address.{address_pub_key, compare_address}
use contract/types.{Datum, Deposit, End, Execute, Init, Mint, Signature, Spend}
use validation/find.{output_by_addr, output_by_addr_value}

validator treasury {
  mint(redeemer: Mint, _policy_id: PolicyId, _transaction: Transaction) {
    when redeemer is {
      Init -> True
      End -> True
    }
  }

  spend(
    datum_option: Option<Datum>,
    redeemer: Spend,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(datum_input) = datum_option
    let Transaction { inputs, outputs, .. } = transaction
    expect Some(input) = find_input(inputs, output_reference)
    let script_address = input.output.address
    let token =
      input.output.value
        |> without_lovelace()

    when redeemer is {
      Deposit -> {
        let output = output_by_addr_value(outputs, script_address, token)
        expect InlineDatum(datum_output_raw) = output.datum
        expect datum_output: Datum = datum_output_raw

        and {
          compare_address(datum_input.receiver, datum_output.receiver) == Equal,
          list.length(list.difference(datum_input.owners, datum_output.owners)) > 0,
          list.length(
            list.difference(datum_input.signers, datum_output.signers),
          ) > 0,
          lovelace_of(output.value) >= lovelace_of(input.output.value),
        }
      }
      Execute -> True
      Signature -> True
    }
  }

  else(_) {
    fail
  }
}
