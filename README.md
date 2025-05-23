# Lord Smearington's Absurd NFT Gallery

A Sui Overflow 2025 Hackathon Project – Minted on Sui, Judged by Madness

## Overview

Lord Smearington's Absurd NFT Gallery is a whimsical platform where artists can submit their artwork to be minted as NFTs on the Sui blockchain. Each submission receives a unique, AI-generated critique from the eccentric art critic, Lord Smearington himself.

## Features

- Connect your Sui wallet to submit artwork
- Upload your own images or generate AI art
- Receive hilarious, over-the-top critiques from Lord Smearington
- Browse the gallery of submitted artwork
- Built on Sui blockchain for secure, efficient NFT minting

## Getting Started

Follow the instructions below to run the project locally.

╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Object Changes │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Created Objects: │
│ ┌── │
│ │ ObjectID: 0x67d78463dfd228bd0aaaac92b38ab7dec0f1f4b729fd42edf3e9c344457c62e2 │
│ │ Sender: 0xddd99e2b3539abdfb553ad6b9513c780b13512120dba7658b688097b5b9d6d0d │
│ │ Owner: Shared( 349178572 ) │
│ │ ObjectType: 0xe8f43803bbf3f5f8f73a05a855f9d61f998865a58bd599e2f81b383e613c0b2e::character::CharacterRegistry │
│ │ Version: 349178572 │
│ │ Digest: C6ZRqJA97NNVFih4TTba9ccnPjMGhtaiorCWPq2BTFgQ │
│ └── │
│ ┌── │
│ │ ObjectID: 0xc3dc5f5c001d9065e1fc308f7a4b995b050e159caa377354eba2e063e63c5dab │
│ │ Sender: 0xddd99e2b3539abdfb553ad6b9513c780b13512120dba7658b688097b5b9d6d0d │
│ │ Owner: Account Address ( 0xddd99e2b3539abdfb553ad6b9513c780b13512120dba7658b688097b5b9d6d0d ) │
│ │ ObjectType: 0x2::package::UpgradeCap │
│ │ Version: 349178572 │
│ │ Digest: F3VydnTHyGdsodBGGuC98dqTMrVU5r1NSPwEZc1wvQ91 │
│ └── │
│ Mutated Objects: │
│ ┌── │
│ │ ObjectID: 0x91af3226c7d77b8f04710b92310d4fbf8ae2334fb562db4f7717d8e3f79001b8 │
│ │ Sender: 0xddd99e2b3539abdfb553ad6b9513c780b13512120dba7658b688097b5b9d6d0d │
│ │ Owner: Account Address ( 0xddd99e2b3539abdfb553ad6b9513c780b13512120dba7658b688097b5b9d6d0d ) │
│ │ ObjectType: 0x2::coin::Coin<0x2::sui::SUI> │
│ │ Version: 349178572 │
│ │ Digest: 3MVVCgbt6GZQrq3zvTUoS3ARToB79yqQGiAcpYbeF5qn │
│ └── │
│ Published Objects: │
│ ┌── │
│ │ PackageID: 0xe8f43803bbf3f5f8f73a05a855f9d61f998865a58bd599e2f81b383e613c0b2e │
│ │ Version: 1 │
│ │ Digest: 2RrKPubDKrbnJzcrtSjLNm9tmkZfiQ7SwsRZ4ycbmzQ1 │
│ │ Modules: character │
│ └── │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

## Important Contract Addresses

Based on the deployment output above, here are the key addresses to use in your application:

### Package Information

- **Package ID**: `0xb5f89236a37a68972feb28099126b8533ec3e203c665ca99fa764d297631b55c`
- **Modules**: `handle`, `realm`
- **Version**: 1

### Registry Objects

- **Realm Registry ID**: `0xeb2836897f90683c4284bd59bb8853d77e0a62f5dbaec8e3f811b22375af6fbc`
  - **Type**: `0xb5f89236a37a68972feb28099126b8533ec3e203c665ca99fa764d297631b55c::realm::RealmRegistry`
  - **Owner**: Shared

### Update Configuration

To use these addresses in your application, update the constants in `src/lib/realmActions.ts`:

## License

This project is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).

You are free to:

- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material for any purpose, even commercially

Under the following terms:

- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made
- No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits

For more information, visit: https://creativecommons.org/licenses/by/4.0/
