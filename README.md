<div align="center">

<img src="https://www.cardano2vn.io/_next/static/media/loading.db59b266.png" width="120" alt="C2VN Logo" />

# **Multisig Treasury Smart Contract**

**A secure multisignature treasury implementation for Cardano using Aiken smart contracts**

[![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Aiken](https://img.shields.io/badge/Aiken-Smart%20Contracts-orange?logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkY2NjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTExLjUgM0M2LjI1IDMgMiA3LjI1IDIgMTJzNC4yNSA5IDkuNSA5IDkuNS00LjI1IDkuNS05LTQuMjUtOS41LTktOS41eiIvPjwvc3ZnPg==)](https://aiken-lang.org/)
[![Cardano](https://img.shields.io/badge/Cardano-L1-green?logo=cardano)](https://cardano.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

</div>

## About Multisig Treasury

This project is a multisignature treasury smart contract implementation for Cardano, built with **Aiken** and **Next.js**. It provides a secure, on-chain mechanism for managing shared assets that require multiple signatures for fund transfers, making it ideal for DAOs, organizations, and collaborative asset management.

This implementation provides:

-   **Aiken-based smart contracts** for multisig treasury validation and security
-   **Next.js frontend** for treasury management and monitoring
-   **Mesh SDK integration** for wallet connectivity and transaction building
-   **Blockfrost API integration** for blockchain data queries and asset tracking
-   **Comprehensive documentation** for developers implementing multisig solutions

The project serves as both a practical tool for creating secure multisig treasuries and an educational resource for understanding Cardano's smart contract capabilities.

### Key Benefits

-   **Multi-Signature Security**: Require multiple signatures for fund transfers to prevent unauthorized access
-   **Flexible Authorization**: Configurable threshold signatures (M-of-N multisig schemes)
-   **Asset Management**: Support for ADA and native tokens in treasury storage
-   **Developer-Friendly**: Aiken smart contracts ensure safe, auditable code
-   **Transparent Operations**: All transactions recorded on-chain for full auditability
-   **Wallet Integration**: Support for major Cardano wallets via CIP-30 standard

### Use Cases

-   **DAO Treasuries**: Decentralized organization fund management with multisig approval
-   **Organizational Accounts**: Enterprise-grade asset custody with shared control
-   **Escrow Services**: Secure holding of assets pending condition fulfillment
-   **Collaborative Investment**: Joint account management with agreed-upon rules

---

## 🌐 Features

-   **Multisig Authorization**  
    Require multiple wallet signatures before fund transfers. Configurable M-of-N schemes (e.g., 2-of-3, 3-of-5) for flexible security levels.

-   **Treasury Management**  
    Deposit, store, and withdraw ADA and native tokens with full multisig approval workflow. Track all treasury operations on-chain.

-   **Proposal System**  
    Create transfer proposals with detailed specifications. Signatories review and approve/reject proposals within the smart contract.

-   **Wallet Integration**  
    Seamless integration with Nami, Eternl, Flint, Lace, and other CIP-30 compatible wallets.

-   **Transaction Building**  
    Mesh SDK-powered transaction builder for treasury operations and multisig approvals.

-   **Blockchain Explorer Integration**  
    Real-time querying via Blockfrost API for treasury status and transaction verification.

-   **Comprehensive Validation**  
    Aiken smart contracts ensure all multisig requirements and treasury rules are enforced before on-chain settlement.

---

## 🛠️ Technology Stack

| Component           | Technologies                               | Purpose                                        |
| ------------------- | ------------------------------------------ | ---------------------------------------------- |
| **Frontend**        | Next.js 13, React, TypeScript, TailwindCSS | Treasury dashboard and multisig interface      |
| **Blockchain**      | Mesh SDK, CIP-30, Blockfrost API           | Wallet integration and blockchain interaction  |
| **Smart Contracts** | Aiken (compiles to Plutus Core)            | Multisig validation and treasury logic         |
| **Transaction**     | Mesh TxBuilder                             | High-level transaction construction            |
| **Data**            | TypeScript interfaces, Plutus JSON         | Type-safe data structures and contract exports |

---

## ⚡ Getting Started

Prerequisites: Node.js 18+, npm/yarn, and Cardano wallets with testnet ADA.

1. **Clone the Repository**

    ```bash
    git clone https://github.com/independenceee/multisig-treasury.git
    cd multisig-treasury
    ```

2. **Install Dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure Environment**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` with:

    - `BLOCKFROST_API_KEY`: Get from [Blockfrost](https://blockfrost.io/)
    - `NETWORK`: Set to `preview` or `mainnet`
    - `CARDANO_NETWORK`: Network configuration

4. **Build Smart Contracts**

    ```bash
    cd contract
    aiken build
    ```

5. **Run Locally**

    ```bash
    npm run dev
    ```

    Access at [http://localhost:3000](http://localhost:3000)

6. **Build for Production**

    ```bash
    npm run build
    npm start
    ```

---

## 📁 Project Structure

```
├── app/                    # Next.js pages and layouts
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage
├── adapters/              # Blockchain adapters
│   └── mesh.adapter.ts    # Mesh SDK adapter
├── providers/             # Blockchain providers
│   └── blockfrost.provider.ts  # Blockfrost integration
├── txbuilders/            # Transaction builders
│   └── mesh.txbuilder.ts  # Transaction construction logic
├── constants/             # Application constants
│   ├── common.constant.ts # Common configurations
│   └── enviroments.constant.ts  # Environment settings
├── types/                 # TypeScript definitions
│   └── index.d.ts         # Type definitions
├── contract/              # Smart contracts
│   ├── lib/               # Aiken library modules
│   │   └── contract/      # Treasury contract types
│   ├── validators/        # Plutus validators
│   │   └── treasury.ak    # Main multisig treasury validator
│   ├── aiken.toml         # Aiken configuration
│   └── plutus.json        # Compiled Plutus Core
├── tests/                 # Test suite
│   └── mesh.test.ts       # Integration tests
└── README.md              # This file
```

---

## 🧑‍💻 Developer Notes

-   **Treasury Validator**: The main smart contract in `contract/validators/treasury.ak` handles all multisig authorization logic
-   **Proposal Datum**: Stores transfer proposals with recipient, amount, and signature count
-   **Multisig Logic**: Smart contract verifies required number of signatures before allowing fund transfers
-   **Testing**: Run `npm test` for Jest unit tests
-   **Extending**: Add new treasury features in `contract/validators/` and compile with `aiken build`
-   **Type Safety**: Leverage TypeScript for frontend and Aiken for smart contracts

For detailed Multisig patterns on Cardano, consult [Cardano Developer Portal](https://developers.cardano.org/).

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork and create a feature branch
2. Commit with clear messages
3. Push to your fork
4. Open a Pull Request

See CONTRIBUTING.md for guidelines.

---

## 📚 Resources

-   [Aiken Language Book](https://aiken-lang.org/book/)
-   [Mesh SDK Documentation](https://meshjs.dev/)
-   [Cardano Developer Portal](https://developers.cardano.org/)
-   [Blockfrost API Docs](https://docs.blockfrost.io/)
-   [Plutus Documentation](https://plutus.readthedocs.io/)

---

## 📝 License

Licensed under the MIT License. Copyright © 2026 independenceee.
