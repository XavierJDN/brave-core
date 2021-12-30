// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

import * as React from 'react'

import { BraveWallet, WalletAccountType } from '../../constants/types'

export default function useBalance (network: BraveWallet.EthereumChain) {
  return React.useCallback((account: WalletAccountType, symbol: string, contractAddress?: string) => {
    let assetBalance = ''

    if (!account) {
      return assetBalance
    }

    if (symbol === network.symbol) {
      return account.balance
    }

    if (!account.tokens) {
      return assetBalance
    }

    const token = account.tokens.find(
      (token) => token.asset.contractAddress === contractAddress
    )
    if (!token) {
      return assetBalance
    }

    return token.assetBalance
  }, [])
}
