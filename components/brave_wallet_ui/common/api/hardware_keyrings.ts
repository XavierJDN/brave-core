/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { assert } from 'chrome://resources/js/assert.m.js'
import { BraveWallet } from '../../constants/types'
import LedgerBridgeKeyring from '../../common/hardware/ledgerjs/eth_ledger_bridge_keyring'
import TrezorBridgeKeyring from '../../common/hardware/trezor/trezor_bridge_keyring'
import * as HWInterfaces from '../hardware/interfaces'
import FilecoinLedgerKeyring from '../hardware/ledgerjs/filecoin_ledger_keyring'
export type HardwareKeyring = LedgerBridgeKeyring | TrezorBridgeKeyring

export function getCoinName (coin: BraveWallet.BraveCoins) {
  switch (coin) {
    case BraveWallet.BraveCoins.FILECOIN:
      return 'Filecoin'
    case BraveWallet.BraveCoins.ETH:
      return 'Ethereum'
  }
  return ''
}

const VendorTypes = [BraveWallet.TREZOR_HARDWARE_VENDOR, BraveWallet.LEDGER_HARDWARE_VENDOR] as const
export type HardwareVendor = typeof VendorTypes[number]

// Lazy instances for keyrings
let ethereumHardwareKeyring: LedgerBridgeKeyring
let filecoinHardwareKeyring: FilecoinLedgerKeyring
let trezorHardwareKeyring: TrezorBridgeKeyring
let keyringController: BraveWallet.KeyringControllerRemote

export function getBraveKeyring (): BraveWallet.KeyringControllerRemote {
  if (!keyringController) {
    /** @type {!braveWallet.mojom.KeyringControllerRemote} */
    keyringController = new BraveWallet.KeyringControllerRemote()
  }
  return keyringController
}

export function getHardwareKeyring (type: HardwareVendor, coin: BraveWallet.BraveCoins = BraveWallet.BraveCoins.ETH): HWInterfaces.LedgerEthereumKeyring | HWInterfaces.TrezorKeyring | HWInterfaces.LedgerFilecoinKeyring {
  if (type === BraveWallet.LEDGER_HARDWARE_VENDOR) {
    const ledgerKeyring = getLedgerHardwareKeyring(coin)
    assert(type === ledgerKeyring.type())
    return ledgerKeyring
  }

  const trezorKeyring = getTrezorHardwareKeyring()
  assert(type === trezorHardwareKeyring.type())
  return trezorKeyring
}

export function getLedgerHardwareKeyring (coin: BraveWallet.BraveCoins): HWInterfaces.LedgerEthereumKeyring | HWInterfaces.LedgerFilecoinKeyring {
  if (coin === BraveWallet.BraveCoins.ETH) {
    if (!ethereumHardwareKeyring) {
      ethereumHardwareKeyring = new LedgerBridgeKeyring()
    }
    return ethereumHardwareKeyring
  }
  assert(coin === BraveWallet.BraveCoins.FILECOIN)
  if (!filecoinHardwareKeyring) {
    filecoinHardwareKeyring = new FilecoinLedgerKeyring()
  }
  return filecoinHardwareKeyring
}

export function getTrezorHardwareKeyring (): TrezorBridgeKeyring {
  if (!trezorHardwareKeyring) {
    trezorHardwareKeyring = new TrezorBridgeKeyring()
  }
  return trezorHardwareKeyring
}
