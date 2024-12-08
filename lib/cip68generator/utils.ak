use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use aiken/primitive/bytearray
use cardano/address.{Address}
use cardano/assets.{AssetName, PolicyId, flatten, lovelace_of, without_lovelace}
use cardano/transaction.{InlineDatum, Input, Output}
use cardano/tx
use types/cip68.{CIP68}

// check the output utxos containing the reference nft
pub fn check_output_utxo(output: Output, vks: List<VerificationKeyHash>) -> Bool {
  expect InlineDatum(data) = output.datum
  expect metadatum: CIP68 = data
  // expect name: ByteArray = cip68.get(metadatum, "name")
  // expect image: ByteArray = cip68.get(metadatum, "image")
  // expect media_type: ByteArray = cip68.get(metadatum, "mediaType")
  expect author: VerificationKeyHash = cip68.get(metadatum, "_pk")
  let output_value =
    output.value
      |> without_lovelace()
      |> flatten()
  and {
    // bytearray.length(name) > 0,
    // bytearray.length(image) > 0,
    // bytearray.length(media_type) > 0,
    tx.verify_signature(vks, author),
    list.length(output_value) == 1,
  }
}

// filter flatten and return pair of asset names
pub fn filter_and_pair(
  flat: List<(PolicyId, AssetName, Int)>,
  prefix100: ByteArray,
  prefix222: ByteArray,
) -> List<(AssetName, AssetName, Int)> {
  let filtered100 =
    list.filter(
      flat,
      fn((_policy_id, asset_name, _amount)) {
        bytearray.starts_with(asset_name, prefix100)
      },
    )
  let filtered222 =
    list.filter(
      flat,
      fn((_policy_id, asset_name, _amount)) {
        bytearray.starts_with(asset_name, prefix222)
      },
    )
  let asset_names_amounts100 =
    list.map(
      filtered100,
      fn((_policy_id, asset_name, amount)) { (asset_name, amount) },
    )
  let asset_names_amounts222 =
    list.map(
      filtered222,
      fn((_policy_id, asset_name, amount)) { (asset_name, amount) },
    )

  let sorted100 =
    list.sort(
      asset_names_amounts100,
      fn((name1, _), (name2, _)) { bytearray.compare(name1, name2) },
    )
  let sorted222 =
    list.sort(
      asset_names_amounts222,
      fn((name1, _), (name2, _)) { bytearray.compare(name1, name2) },
    )

  let paired = list.zip(sorted100, sorted222)
  list.map(
    paired,
    fn(((name1, amount1), (name2, amount2))) {
      (name1, name2, amount1 + amount2)
    },
  )
}

pub fn filter_prefix(
  flatten: List<(PolicyId, AssetName, Int)>,
  prefix: ByteArray,
) -> List<(AssetName, Int)> {
  let filtered =
    list.filter(
      flatten,
      fn((_policy_id, asset_name, _amount)) {
        bytearray.starts_with(asset_name, prefix)
      },
    )

  list.map(
    filtered,
    fn((_policy_id, asset_name, amount)) { (asset_name, -amount) },
  )
}

// check assets pairs with fold
pub fn check_pairs_with_fold(
  flat: List<(PolicyId, AssetName, Int)>,
  prefix1: ByteArray,
  prefix2: ByteArray,
  check_fn: fn(AssetName, AssetName, Int) -> Bool,
) -> Bool {
  let pairs = filter_and_pair(flat, prefix1, prefix2)

  list.foldl(
    pairs,
    True,
    fn((asset1, asset2, amount), acc) {
      if !acc {
        False
      } else {
        check_fn(asset1, asset2, amount)
      }
    },
  )
}

// check assets pairs with prefix pairs
pub fn check_pairs_with_fold_with_prefix(
  flat: List<(PolicyId, AssetName, Int)>,
  prefix: ByteArray,
  check_fn: fn(AssetName, Int) -> Bool,
) -> Bool {
  let pairs = filter_prefix(flat, prefix)

  list.foldl(
    pairs,
    True,
    fn((asset_name, amount), acc) {
      if !acc {
        False
      } else {
        check_fn(asset_name, amount)
      }
    },
  )
}

// check none token from asset name use only for user_token and reference_token
pub fn check_none_token(
  user_token: Option<AssetName>,
  reference_token: Option<AssetName>,
) -> Bool {
  if user_token == None || reference_token == None {
    False
  } else {
    True
  }
}

// check address from output
pub fn check_address(output: Output, address: Address) -> Bool {
  output.address.payment_credential == address.payment_credential
}

// The function checks whether the output exists or not
pub fn check_none_output(
  output_store: Option<Output>,
  output_exchange: Option<Output>,
) -> Bool {
  // If one of the 3 outputs does not exist, the function will return False
  if output_store == None || output_exchange == None {
    False
  } else {
    // Otherwise, the function will return True
    True
  }
}

// find output with lovelace on
pub fn find_output(
  outputs: List<Output>,
  price: Int,
  address: Address,
) -> Option<Output> {
  list.find(
    outputs,
    fn(output) { check_amount(output, price) && check_address(output, address) },
  )
}

// check price duplicate fromt author address = exchange address
pub fn check_price_duplicate(owner: Output, exchange: Output) -> Bool {
  lovelace_of(owner.value) > lovelace_of(exchange.value)
}

// the function ce
pub fn check_address_duplicate(
  output_author: Output,
  output_exchange: Output,
) -> Bool {
  output_author.address.payment_credential == output_exchange.address.payment_credential
}

// The function checks the amount
pub fn check_amount(output: Output, price: Int) -> Bool {
  lovelace_of(output.value) >= price
}

// Check the output utxo containing the reference nft
pub fn check_output_utxo_reference_token(output: Output) -> Bool {
  let output_value =
    output.value
      |> without_lovelace()
      |> flatten()
  // Check no other token is present in the utxo containing reference nft
  list.length(output_value) == 1
}

// search reference asset exist input
pub fn find_input_reference_asset(
  inputs: List<Input>,
  vks: List<VerificationKeyHash>,
) -> List<(PolicyId, AssetName, Int)> {
  list.filter_map(
    inputs,
    fn(input) {
      when input.output.datum is {
        InlineDatum(data) -> {
          expect metadatum: CIP68 = data
          expect author: VerificationKeyHash = cip68.get(metadatum, "_pk")
          if tx.verify_signature(vks, author) {
            let reference_asset =
              input.output.value
                |> without_lovelace()
                |> assets.flatten()
            let exist =
              list.find(
                reference_asset,
                fn((_policy_id, asset_name, _amount)) {
                  bytearray.starts_with(asset_name, cip68.prefix_100)
                },
              )
            when exist is {
              Some((policy_id, asset_name, amount)) ->
                Some((policy_id, asset_name, amount))
              None -> None
            }
          } else {
            None
          }
        }
        _ -> None
      }
    },
  )
}

pub fn find_input_reference_asset_burn(
  inputs: List<Input>,
  vks: List<VerificationKeyHash>,
) -> List<(PolicyId, AssetName, Int)> {
  list.filter_map(
    inputs,
    fn(input) {
      when input.output.datum is {
        InlineDatum(data) -> {
          expect metadatum: CIP68 = data
          expect author: VerificationKeyHash = cip68.get(metadatum, "_pk")
          if tx.verify_signature(vks, author) {
            let reference_asset =
              input.output.value
                |> without_lovelace()
                |> assets.flatten()
            let exist =
              list.find(
                reference_asset,
                fn((_policy_id, asset_name, _amount)) {
                  bytearray.starts_with(asset_name, cip68.prefix_100)
                },
              )
            when exist is {
              Some((policy_id, asset_name, amount)) ->
                Some((policy_id, asset_name, -amount))
              None -> None
            }
          } else {
            None
          }
        }
        _ -> None
      }
    },
  )
}
