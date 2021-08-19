/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react'

import { LocaleContext, formatMessage } from '../../lib/locale_context'
import { MainButton } from './main_button'
import { NewTabLink } from '../new_tab_link'

import { CashbackIcon } from './icons/cashback_icon'
import { CheckCircleIcon } from './icons/check_circle_icon'

import * as style from './brave_talk_opt_in_form.style'

const termsOfServiceURL = 'https://brave.com/terms-of-use'
const privacyPolicyURL = 'https://brave.com/privacy/browser'

interface Props {
  rewardsEnabled: boolean
  onEnable: () => void
  onTakeTour: () => void
}

export function BraveTalkOptInForm (props: Props) {
  const { getString } = React.useContext(LocaleContext)
  const [showStartFreeCall, setShowStartFreeCall] = React.useState(false)

  const onRewardsTurnedOn = () => {
    props.onEnable()
    setShowStartFreeCall(true)
  }

  if (showStartFreeCall) {
    return (
      <style.root>
        <CheckCircleIcon />
        <style.header>
          {getString('braveTalkCanStartFreeCall')}
        </style.header>
        <style.text>
          {getString('braveTalkClickAnywhereToBraveTalk')}
        </style.text>
        <style.learn>
          {
            formatMessage(getString('braveTalkWantLearnMore'), {
              tags: {
                $1: (content) => (
                  <style.tour key='tour' onClick={props.onTakeTour}>
                    {content}
                  </style.tour>
                )
              }
            })
          }
        </style.learn>
      </style.root>
    )
  }

  if (props.rewardsEnabled) {
    return (
      <style.root>
        <CashbackIcon />
        <style.header>
          {getString('braveTalkTurnOnPrivateAdsToStartCall')}
        </style.header>
        <style.text>
          {getString('braveTalkPrivateAdsDescription')}
        </style.text>
        <style.enable>
          <MainButton onClick={onRewardsTurnedOn} testId={'brave-talk-turn-on-private-ads'}>
            {getString('braveTalkTurnOnPrivateAds')}
          </MainButton>
        </style.enable>
      </style.root>
    )
  }

  return (
    <style.root>
      <CashbackIcon />
      <style.header>
        {getString('braveTalkTurnOnRewardsToStartCall')}
      </style.header>
      <style.text>
        {getString('braveTalkBraveRewardsDescription')}
      </style.text>
      <style.enable>
        <MainButton onClick={onRewardsTurnedOn} testId={'brave-talk-turn-on-rewards'}>
          {getString('braveTalkTurnOnRewards')}
        </MainButton>
      </style.enable>
      <style.terms>
        {
          formatMessage(getString('braveTalkOptInTerms'), {
            tags: {
              $1: (content) => (
                <NewTabLink key='terms' href={termsOfServiceURL}>
                  {content}
                </NewTabLink>
              ),
              $3: (content) => (
                <NewTabLink key='privacy' href={privacyPolicyURL}>
                  {content}
                </NewTabLink>
              )
            }
          })
        }
      </style.terms>
    </style.root>
  )
}
