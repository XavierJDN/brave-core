/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

export const enum types {
  IS_INITIALIZED = '@@rewards/IS_INITIALIZED',
  CREATE_WALLET = '@@rewards/CREATE_WALLET',
  WALLET_CREATED = '@@rewards/WALLET_CREATED',
  WALLET_CREATE_FAILED = '@@rewards/WALLET_CREATE_FAILED',
  ON_SETTING_SAVE = '@@rewards/ON_SETTING_SAVE',
  ON_REWARDS_PARAMETERS = '@@rewards/ON_REWARDS_PARAMETERS',
  GET_REWARDS_PARAMETERS = '@@rewards/GET_REWARDS_PARAMETERS',
  GET_AUTO_CONTRIBUTE_PROPERTIES = '@@rewards/GET_AUTO_CONTRIBUTE_PROPERTIES',
  ON_AUTO_CONTRIBUTE_PROPERTIES = '@@rewards/ON_AUTO_CONTRIBUTE_PROPERTIES',
  FETCH_PROMOTIONS = '@@rewards/FETCH_PROMOTIONS',
  ON_PROMOTIONS = '@@rewards/ON_PROMOTION',
  CLAIM_PROMOTION = '@@rewards/CLAIM_PROMOTION',
  ON_CLAIM_PROMOTION = '@@rewards/ON_CLAIM_PROMOTION',
  ATTEST_PROMOTION = '@@rewards/ATTEST_PROMOTION',
  RESET_PROMOTION = '@@rewards/RESET_PROMOTION',
  DELETE_PROMOTION = '@@rewards/DELETE_PROMOTION',
  ON_PROMOTION_FINISH = '@@rewards/ON_PROMOTION_FINISH',
  RECOVER_WALLET = '@@rewards/RECOVER_WALLET',
  ON_RECOVER_WALLET_DATA = '@@rewards/ON_RECOVER_WALLET_DATA',
  ON_MODAL_BACKUP_CLOSE = '@@rewards/ON_MODAL_BACKUP_CLOSE',
  ON_MODAL_BACKUP_OPEN = '@@rewards/ON_MODAL_BACKUP_OPEN',
  ON_CLEAR_ALERT = '@@rewards/ON_CLEAR_ALERT',
  ON_RECONCILE_STAMP = '@@rewards/ON_RECONCILE_STAMP',
  ON_CONTRIBUTE_LIST = '@@rewards/ON_CONTRIBUTE_LIST',
  ON_EXCLUDE_PUBLISHER = '@@rewards/ON_EXCLUDE_PUBLISHER',
  ON_RESTORE_PUBLISHERS = '@@rewards/ON_RESTORE_PUBLISHERS',
  CHECK_WALLET_EXISTENCE = '@@rewards/CHECK_WALLET_EXISTENCE',
  ON_WALLET_EXISTS = '@@rewards/ON_WALLET_EXISTS',
  ON_EXCLUDED_PUBLISHERS_NUMBER = '@@rewards/ON_EXCLUDED_PUBLISHERS_NUMBER',
  GET_CONTRIBUTION_AMOUNT = '@@rewards/GET_CONTRIBUTION_AMOUNT',
  ON_CONTRIBUTION_AMOUNT = '@@rewards/ON_CONTRIBUTION_AMOUNT',
  ON_RECURRING_TIPS = '@@rewards/ON_RECURRING_TIPS',
  REMOVE_RECURRING_TIP = '@@rewards/REMOVE_RECURRING_TIP',
  ON_CURRENT_TIPS = '@@rewards/ON_CURRENT_TIPS',
  GET_TIP_TABLE = '@@rewards/GET_TIP_TABLE',
  GET_CONTRIBUTE_LIST = '@@rewards/GET_CONTRIBUTE_LIST',
  INIT_AUTOCONTRIBUTE_SETTINGS = '@@rewards/INIT_AUTOCONTRIBUTE_SETTINGS',
  GET_ADS_DATA = '@@rewards/GET_ADS_DATA',
  ON_ADS_DATA = '@@rewards/ON_ADS_DATA',
  GET_ADS_HISTORY = '@@rewards/GET_ADS_HISTORY',
  TOGGLE_AD_THUMB_UP = '@@rewards/TOGGLE_AD_THUMB_UP',
  ON_TOGGLE_AD_THUMB_UP = '@@rewards/ON_TOGGLE_AD_THUMB_UP',
  TOGGLE_AD_THUMB_DOWN = '@@rewards/TOGGLE_AD_THUMB_DOWN',
  ON_TOGGLE_AD_THUMB_DOWN = '@@rewards/ON_TOGGLE_AD_THUMB_DOWN',
  TOGGLE_AD_OPT_IN_ACTION = '@@rewards/TOGGLE_AD_OPT_IN_ACTION',
  ON_TOGGLE_AD_OPT_IN_ACTION = '@@rewards/ON_TOGGLE_AD_OPT_IN_ACTION',
  TOGGLE_AD_OPT_OUT_ACTION = '@@rewards/TOGGLE_AD_OPT_OUT_ACTION',
  ON_TOGGLE_AD_OPT_OUT_ACTION = '@@rewards/ON_TOGGLE_AD_OPT_OUT_ACTION',
  TOGGLE_SAVE_AD = '@@rewards/TOGGLE_SAVE_AD',
  ON_TOGGLE_SAVE_AD = '@@rewards/ON_TOGGLE_SAVE_AD',
  TOGGLE_FLAG_AD = '@@rewards/TOGGLE_FLAG_AD',
  ON_TOGGLE_FLAG_AD = '@@rewards/ON_TOGGLE_FLAG_AD',
  ON_ADS_HISTORY = '@@rewards/ON_ADS_HISTORY',
  ON_ADS_SETTING_SAVE = '@@rewards/ON_ADS_SETTING_SAVE',
  GET_BALANCE_REPORT = '@@rewards/GET_BALANCE_REPORT',
  ON_BALANCE_REPORT = '@@rewards/ON_BALANCE_REPORT',
  GET_RECONCILE_STAMP = '@@rewards/GET_RECONCILE_STAMP',
  GET_PENDING_CONTRIBUTIONS = '@@rewards/GET_PENDING_CONTRIBUTIONS',
  ON_PENDING_CONTRIBUTIONS = '@@rewards/ON_PENDING_CONTRIBUTIONS',
  ON_REWARDS_ENABLED = '@@rewards/ON_REWARDS_ENABLED',
  GET_TRANSACTION_HISTORY = '@@rewards/GET_TRANSACTION_HISTORY',
  ON_TRANSACTION_HISTORY = '@@rewards/ON_TRANSACTION_HISTORY',
  ON_TRANSACTION_HISTORY_CHANGED = '@@rewards/ON_TRANSACTION_HISTORY_CHANGED',
  GET_REWARDS_MAIN_ENABLED = '@@rewards/GET_REWARDS_MAIN_ENABLED',
  ON_RECURRING_TIP_SAVED = '@@rewards/ON_RECURRING_TIP_SAVED',
  ON_RECURRING_TIP_REMOVED = '@@rewards/ON_RECURRING_TIP_REMOVED',
  ON_INLINE_TIP_SETTINGS_CHANGE = '@@rewards/ON_INLINE_TIP_SETTINGS_CHANGE',
  REMOVE_PENDING_CONTRIBUTION = '@@rewards/REMOVE_PENDING_CONTRIBUTION',
  REMOVE_ALL_PENDING_CONTRIBUTION = '@@rewards/REMOVE_ALL_PENDING_CONTRIBUTION',
  ON_EXCLUDED_LIST = '@@rewards/ON_EXCLUDED_LIST',
  ON_RESTORE_PUBLISHER = '@@rewards/ON_RESTORE_PUBLISHER',
  GET_EXCLUDED_SITES = '@@rewards/GET_EXCLUDED_SITES',
  GET_BALANCE = '@@rewards/GET_BALANCE',
  ON_BALANCE = '@@rewards/ON_BALANCE',
  GET_EXTERNAL_WALLET = '@@rewards/GET_EXTERNAL_WALLET',
  ON_EXTERNAL_WALLET = '@@rewards/ON_EXTERNAL_WALLET',
  ON_ON_BOARDING_DISPLAYED = '@@rewards/ON_ON_BOARDING_DISPLAYED',
  PROCESS_REWARDS_PAGE_URL = '@@rewards/PROCESS_REWARDS_PAGE_URL',
  ON_PROCESS_REWARDS_PAGE_URL = '@@rewards/ON_PROCESS_REWARDS_PAGE_URL',
  HIDE_REDIRECT_MODAL = '@@rewards/HIDE_REDIRECT_MODAL',
  DISCONNECT_WALLET = '@@rewards/DISCONNECT_WALLET',
  ONLY_ANON_WALLET = '@@rewards/ONLY_ANON_WALLET',
  ON_ONLY_ANON_WALLET = '@@rewards/ON_ONLY_ANON_WALLET',
  GET_MONTHLY_REPORT = '@@rewards/GET_MONTHLY_REPORT',
  ON_MONTHLY_REPORT = '@@rewards/ON_MONTHLY_REPORT',
  ON_RECONCILE_STAMP_RESET = '@@rewards/ON_RECONCILE_STAMP_RESET',
  GET_MONTHLY_REPORT_IDS = '@@rewards/GET_MONTHLY_REPORT_IDS',
  ON_MONTHLY_REPORT_IDS = '@@rewards/ON_MONTHLY_REPORT_IDS',
  DISMISS_PROMO_PROMPT = '@@rewards/DISMISS_PROMO_PROMPT',
  GET_COUNTRY_CODE = '@@rewards/GET_COUNTRY_CODE',
  ON_COUNTRY_CODE = '@@rewards/ON_COUNTRY_CODE',
  TOGGLE_ENABLE_MAIN = '@@rewards/TOGGLE_ENABLE_MAIN',
  ON_INITIALIZED = '@@rewards/ON_INITIALIZED',
  COMPLETE_RESET = '@@rewards/COMPLETE_RESET',
  ON_COMPLETE_RESET = '@@rewards/ON_COMPLETE_RESET',
  GET_PAYMENT_ID = '@@rewards/GET_PAYMENT_ID',
  ON_PAYMENT_ID = '@@rewards/ON_PAYMENT_ID'
}
