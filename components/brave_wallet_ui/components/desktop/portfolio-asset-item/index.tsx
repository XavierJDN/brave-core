import * as React from 'react'

// Options
import { BraveWallet, DefaultCurrencies } from '../../../constants/types'
import { formatBalance, hexToNumber } from '../../../utils/format-balances'

// Styled Components
import {
  StyledWrapper,
  AssetBalanceText,
  AssetName,
  BalanceColumn,
  FiatBalanceText,
  NameAndIcon,
  AssetIcon
} from './style'
import {
  formatFiatAmountWithCommasAndDecimals,
  formatTokenAmountWithCommasAndDecimals
} from '../../../utils/format-prices'
import { withPlaceholderIcon } from '../../shared'

export interface Props {
  action?: () => void
  assetBalance: string
  fiatBalance: string
  token: BraveWallet.ERCToken
  defaultCurrencies: DefaultCurrencies
}

const PortfolioAssetItem = (props: Props) => {
  const {
    assetBalance,
    fiatBalance,
    action,
    token,
    defaultCurrencies
  } = props

  const AssetIconWithPlaceholder = React.useMemo(() => {
    return withPlaceholderIcon(AssetIcon, { size: 'big', marginLeft: 0, marginRight: 8 })
  }, [])

  const formattedAssetBalance = token.isErc721
    ? formatBalance(assetBalance, token.decimals)
    : formatTokenAmountWithCommasAndDecimals(formatBalance(assetBalance, token.decimals), token.symbol)

  return (
    <>
      {token.visible &&
        // Selecting an erc721 token is temp disabled until UI is ready for viewing NFT's
        <StyledWrapper disabled={token.isErc721} onClick={action}>
          <NameAndIcon>
            <AssetIconWithPlaceholder selectedAsset={token} />
            <AssetName>{token.name} {token.isErc721 ? hexToNumber(token.tokenId ?? '') : ''}</AssetName>
          </NameAndIcon>
          <BalanceColumn>
            {!token.isErc721 &&
              <FiatBalanceText>{formatFiatAmountWithCommasAndDecimals(fiatBalance, defaultCurrencies.fiat)}</FiatBalanceText>
            }
            <AssetBalanceText>{formattedAssetBalance}</AssetBalanceText>
          </BalanceColumn>
        </StyledWrapper>
      }
    </>
  )
}

export default PortfolioAssetItem
