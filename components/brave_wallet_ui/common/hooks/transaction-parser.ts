/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'

import {
  BraveWallet,
  TimeDelta,
  WalletAccountType
} from '../../constants/types'

// Utils
import {
  formatBalance,
  formatFiatBalance,
  formatGasFeeFromFiat,
  hexToNumber
} from '../../utils/format-balances'
import {
  addNumericValues,
  isNumericValueGreaterThan,
  multiplyNumericValues,
  normalizeNumericValue
} from '../../utils/bn-utils'

// Hooks
import usePricing from './pricing'
import useAddressLabels, { SwapExchangeProxy } from './address-labels'

import { getLocale } from '../../../common/locale'

interface ParsedTransactionFees {
  gasLimit: string
  gasPrice: string
  maxPriorityFeePerGas: string
  maxFeePerGas: string
  gasFee: string
  gasFeeFiat: string
  isEIP1559Transaction: boolean
}

interface ParsedTransaction extends ParsedTransactionFees {
  // Common fields
  hash: string
  createdTime: TimeDelta
  status: BraveWallet.TransactionStatus
  sender: string
  senderLabel: string
  recipient: string
  recipientLabel: string
  fiatValue: string
  fiatTotal: string
  nativeCurrencyTotal: string
  value: string
  symbol: string
  decimals: number
  insufficientFundsError: boolean
  contractAddressError?: string
  sameAddressError?: string
  erc721ERCToken?: BraveWallet.ERCToken
  erc721TokenId?: string
  isSwap?: boolean

  // Token approvals
  approvalTarget?: string
  approvalTargetLabel?: string
}

export function useTransactionFeesParser (selectedNetwork: BraveWallet.EthereumChain, networkSpotPrice: string) {
  return React.useCallback((transactionInfo: BraveWallet.TransactionInfo): ParsedTransactionFees => {
    const { txData } = transactionInfo
    const { baseData: { gasLimit, gasPrice }, maxFeePerGas, maxPriorityFeePerGas } = txData

    const isEIP1559Transaction = maxPriorityFeePerGas !== '' && maxFeePerGas !== ''
    const gasFee = isEIP1559Transaction
      ? multiplyNumericValues(maxFeePerGas, gasLimit)
      : multiplyNumericValues(gasPrice, gasLimit)

    return {
      gasLimit: normalizeNumericValue(gasLimit),
      gasPrice: normalizeNumericValue(gasPrice),
      maxFeePerGas: normalizeNumericValue(maxFeePerGas),
      maxPriorityFeePerGas: normalizeNumericValue(maxPriorityFeePerGas),
      gasFee,
      gasFeeFiat: formatFiatBalance(gasFee, selectedNetwork.decimals, networkSpotPrice),
      isEIP1559Transaction
    }
  }, [selectedNetwork, networkSpotPrice])
}

export function useTransactionParser (
  selectedNetwork: BraveWallet.EthereumChain,
  accounts: WalletAccountType[],
  spotPrices: BraveWallet.AssetPrice[],
  visibleTokens: BraveWallet.ERCToken[],
  fullTokenList?: BraveWallet.ERCToken[]
) {
  const { findAssetPrice, computeFiatAmount } = usePricing(spotPrices)
  const getAddressLabel = useAddressLabels(accounts)
  const networkSpotPrice = React.useMemo(
    () => findAssetPrice(selectedNetwork.symbol),
    [selectedNetwork, findAssetPrice]
  )
  const parseTransactionFees = useTransactionFeesParser(selectedNetwork, networkSpotPrice)

  const findToken = React.useCallback((contractAddress: string) => {
    const checkVisibleList = visibleTokens.find((token) => token.contractAddress.toLowerCase() === contractAddress.toLowerCase())
    return checkVisibleList ?? (fullTokenList?.find((token) => token.contractAddress.toLowerCase() === contractAddress.toLowerCase()))
  }, [visibleTokens, fullTokenList])

  /**
   * Checks if a given address is a known contract address from our token
   * registry.
   *
   * @remarks
   *
   * This function must only be used for the following transaction types:
   *  - ERC20Transfer
   *  - ERC721TransferFrom
   *  - ERC721SafeTransferFrom
   *
   * @param to - The address to check
   * @returns Localized string describing the error, or undefined in case of
   * no error.
   */
  const checkForContractAddressError = (to: string): string | undefined => {
    return fullTokenList?.some(token => token.contractAddress.toLowerCase() === to.toLowerCase())
      ? getLocale('braveWalletContractAddressError')
      : undefined
  }

  /**
   * Checks if a given set of sender and recipient addresses are the
   * same.
   *
   * @remarks
   *
   * This function must only be used for the following transaction types:
   *  - ERC20Transfer
   *  - ERC721TransferFrom
   *  - ERC721SafeTransferFrom
   *  - ERC20Approve
   *  - ETHSend
   *
   * @param to - The recipient address
   * @param from - The sender address
   */
  const checkForSameAddressError = (to: string, from: string): string | undefined => {
    return to.toLowerCase() === from.toLowerCase()
      ? getLocale('braveWalletSameAddressError')
      : undefined
  }

  return React.useCallback((transactionInfo: BraveWallet.TransactionInfo) => {
    const { txArgs, txData, fromAddress, txType } = transactionInfo
    const { baseData } = txData
    const { value, to } = baseData
    const account = accounts.find((account) => account.address.toLowerCase() === fromAddress.toLowerCase())
    const accountsNativeBalance = accounts.find(
      (account) => account.address.toLowerCase() === fromAddress.toLowerCase()
    )?.balance || '0'
    const usersTokenInfo = account?.tokens.find((asset) => asset.asset.contractAddress.toLowerCase() === to.toLowerCase())

    switch (true) {
      // transfer(address recipient, uint256 amount) → bool
      case txType === BraveWallet.TransactionType.ERC20Transfer: {
        const [address, amount] = txArgs
        const token = findToken(to)
        const price = findAssetPrice(token?.symbol ?? '')
        const sendAmount = normalizeNumericValue(amount)
        const sendAmountFiat = formatFiatBalance(amount, token?.decimals ?? 18, price)

        const feeDetails = parseTransactionFees(transactionInfo)
        const { gasFeeFiat, gasFee } = feeDetails
        const totalAmountFiat = (Number(gasFeeFiat) + Number(sendAmountFiat)).toFixed(2)
        const accountsTokenBalance = usersTokenInfo?.assetBalance ?? '0'
        const insufficientNativeFunds = isNumericValueGreaterThan(gasFee, accountsNativeBalance)
        const insufficientTokenFunds = isNumericValueGreaterThan(sendAmount, accountsTokenBalance)

        return {
          hash: transactionInfo.txHash,
          createdTime: transactionInfo.createdTime,
          status: transactionInfo.txStatus,
          sender: fromAddress,
          senderLabel: getAddressLabel(fromAddress),
          recipient: address,
          recipientLabel: getAddressLabel(address),
          fiatValue: sendAmountFiat,
          fiatTotal: totalAmountFiat,
          nativeCurrencyTotal: formatGasFeeFromFiat(sendAmountFiat, networkSpotPrice),
          value: formatBalance(amount, token?.decimals ?? 18),
          symbol: token?.symbol ?? '',
          decimals: token?.decimals ?? 18,
          insufficientFundsError: insufficientNativeFunds || insufficientTokenFunds,
          contractAddressError: checkForContractAddressError(address),
          sameAddressError: checkForSameAddressError(address, fromAddress),
          ...feeDetails
        } as ParsedTransaction
      }

      // transferFrom(address owner, address to, uint256 tokenId)
      case txType === BraveWallet.TransactionType.ERC721TransferFrom:

      // safeTransferFrom(address owner, address to, uint256 tokenId)
      case txType === BraveWallet.TransactionType.ERC721SafeTransferFrom: {
        // The owner of the ERC721 must not be confused with the
        // caller (fromAddress).
        const [owner, toAddress, tokenID] = txArgs
        const token = findToken(to)

        const feeDetails = parseTransactionFees(transactionInfo)
        const { gasFeeFiat, gasFee } = feeDetails
        const totalAmountFiat = gasFeeFiat

        const insufficientNativeFunds = isNumericValueGreaterThan(gasFee, accountsNativeBalance)

        return {
          hash: transactionInfo.txHash,
          createdTime: transactionInfo.createdTime,
          status: transactionInfo.txStatus,
          sender: fromAddress, // The caller, which may not be the owner
          senderLabel: getAddressLabel(fromAddress),
          recipient: toAddress,
          recipientLabel: getAddressLabel(toAddress),
          fiatValue: '0.00', // Display NFT values in the future
          fiatTotal: totalAmountFiat,
          nativeCurrencyTotal: formatGasFeeFromFiat(totalAmountFiat, networkSpotPrice),
          value: '1', // Can only send 1 erc721 at a time
          symbol: token?.symbol ?? '',
          decimals: 0,
          insufficientFundsError: insufficientNativeFunds,
          erc721ERCToken: token,
          erc721TokenId: hexToNumber(tokenID ?? ''),
          contractAddressError: checkForContractAddressError(toAddress),
          sameAddressError: checkForSameAddressError(toAddress, owner),
          ...feeDetails
        } as ParsedTransaction
      }

      // approve(address spender, uint256 amount) → bool
      case txType === BraveWallet.TransactionType.ERC20Approve: {
        const [address, amount] = txArgs
        const token = findToken(to)
        const feeDetails = parseTransactionFees(transactionInfo)
        const { gasFeeFiat, gasFee } = feeDetails
        const totalAmountFiat = Number(gasFeeFiat).toFixed(2)
        const insufficientNativeFunds = isNumericValueGreaterThan(gasFee, accountsNativeBalance)
        const formattedValue = formatBalance(amount, token?.decimals ?? 18)
        const userTokenBalance = usersTokenInfo?.assetBalance ?? '0'
        const allowanceValue = isNumericValueGreaterThan(amount, userTokenBalance)
          ? getLocale('braveWalletTransactionApproveUnlimited')
          : formattedValue

        return {
          hash: transactionInfo.txHash,
          createdTime: transactionInfo.createdTime,
          status: transactionInfo.txStatus,
          sender: fromAddress,
          senderLabel: getAddressLabel(fromAddress),
          recipient: to,
          recipientLabel: getAddressLabel(to),
          fiatValue: (0).toFixed(2),
          fiatTotal: totalAmountFiat,
          nativeCurrencyTotal: (0).toFixed(2),
          value: allowanceValue,
          symbol: token?.symbol ?? '',
          decimals: token?.decimals ?? 18,
          approvalTarget: address,
          approvalTargetLabel: getAddressLabel(address),
          insufficientFundsError: insufficientNativeFunds,
          sameAddressError: checkForSameAddressError(address, fromAddress),
          ...feeDetails
        } as ParsedTransaction
      }

      // FIXME: swap needs a real parser to figure out the From and To details.
      case to.toLowerCase() === SwapExchangeProxy:
      case txType === BraveWallet.TransactionType.ETHSend:
      case txType === BraveWallet.TransactionType.Other:
      default: {
        const sendAmountFiat = computeFiatAmount(value, selectedNetwork.symbol, selectedNetwork.decimals)

        const feeDetails = parseTransactionFees(transactionInfo)
        const { gasFeeFiat, gasFee } = feeDetails
        const totalAmountFiat = (Number(gasFeeFiat) + Number(sendAmountFiat)).toFixed(2)

        return {
          hash: transactionInfo.txHash,
          createdTime: transactionInfo.createdTime,
          status: transactionInfo.txStatus,
          sender: fromAddress,
          senderLabel: getAddressLabel(fromAddress),
          recipient: to,
          recipientLabel: getAddressLabel(to),
          fiatValue: sendAmountFiat,
          fiatTotal: totalAmountFiat,
          nativeCurrencyTotal: formatGasFeeFromFiat(sendAmountFiat, networkSpotPrice),
          value: formatBalance(value, selectedNetwork.decimals),
          symbol: selectedNetwork.symbol,
          decimals: selectedNetwork?.decimals ?? 18,
          insufficientFundsError: isNumericValueGreaterThan(addNumericValues(gasFee, value), accountsNativeBalance),
          isSwap: to.toLowerCase() === SwapExchangeProxy,
          ...feeDetails
        } as ParsedTransaction
      }
    }
  }, [selectedNetwork, spotPrices, findToken])
}
