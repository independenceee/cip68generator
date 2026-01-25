protected convertDatum = ({ plutusData }: { plutusData: string }): {
  receiver: string;
  owners: string[];
  signers: string[];
} => {
  try {
    const datum = deserializeDatum(plutusData);

    console.dir(datum, { depth: null, colors: true });

    // Helper: build Bech32 address from two hex credential hashes (28 bytes each)
    const buildAddress = (paymentHex: string, stakeHex?: string): string => {
      if (paymentHex.length !== 56) throw new Error("Invalid payment hash length");
      return serializeAddressObj(
        pubKeyAddress(paymentHex, stakeHex || "", false), // false = not script hash
        APP_NETWORK_ID
      );
    };

    // 1. Receiver (base address with stake credential)
    const receiverPayment = datum.fields[0]?.fields?.[0]?.fields?.[0]?.bytes;
    const receiverStake   = datum.fields[0]?.fields?.[1]?.fields?.[0]?.fields?.[0]?.bytes;

    if (!receiverPayment) throw new Error("Missing receiver payment credential");

    const receiver = buildAddress(receiverPayment, receiverStake);

    // 2. Owners (list of addresses, usually with stake credential)
    const ownersList = datum.fields[1]?.list || [];
    const owners = ownersList.map((item: any, index: number) => {
      const payment = item?.fields?.[0]?.bytes;
      const stake   = item?.fields?.[1]?.bytes;

      if (!payment) throw new Error(`Owner #${index + 1}: missing payment credential`);

      return buildAddress(payment, stake);
    });

    // 3. Signers (can be empty)
    const signersList = datum.fields[2]?.list || [];
    const signers = signersList.map((item: any, index: number) => {
      const payment = item?.fields?.[0]?.bytes;
      const stake   = item?.fields?.[1]?.bytes;

      if (!payment) throw new Error(`Signer #${index + 1}: missing payment credential`);

      return buildAddress(payment, stake);
    });

    return { receiver, owners, signers };
  } catch (err) {
    console.error("Datum parsing failed", err);
    throw new Error(`Invalid datum format: ${String(err)}`);
  }
};
