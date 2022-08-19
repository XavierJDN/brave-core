/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "bat/ads/internal/creatives/notification_ads/notification_ad_manager.h"

#include <algorithm>

#include "base/bind.h"
#include "base/check_op.h"
#include "base/values.h"
#include "bat/ads/ad_type.h"
#include "bat/ads/internal/ads_client_helper.h"
#include "bat/ads/internal/browser/browser_util.h"
#include "bat/ads/internal/creatives/notification_ads/notification_ad_manager_values_util.h"
#include "bat/ads/notification_ad_info.h"
#include "bat/ads/pref_names.h"
#include "build/build_config.h"

#if BUILDFLAG(IS_ANDROID)
#include "bat/ads/internal/browser/browser_manager.h"
#endif  // BUILDFLAG(IS_ANDROID)

namespace ads {

namespace {

NotificationAdManager* g_notification_ad_manager_instance = nullptr;

#if BUILDFLAG(IS_ANDROID)
constexpr int kMaximumNotificationAds = 3;
#else   // !BUILDFLAG(IS_ANDROID)
constexpr int kMaximumNotificationAds = 0;  // Unlimited
#endif  // BUILDFLAG(IS_ANDROID)

}  // namespace

NotificationAdManager::NotificationAdManager() {
  DCHECK(!g_notification_ad_manager_instance);
  g_notification_ad_manager_instance = this;

  Initialize();
}

NotificationAdManager::~NotificationAdManager() {
  DCHECK_EQ(this, g_notification_ad_manager_instance);
  g_notification_ad_manager_instance = nullptr;
}

// static
NotificationAdManager* NotificationAdManager::GetInstance() {
  DCHECK(g_notification_ad_manager_instance);
  return g_notification_ad_manager_instance;
}

// static
bool NotificationAdManager::HasInstance() {
  return !!g_notification_ad_manager_instance;
}

absl::optional<NotificationAdInfo>
NotificationAdManager::MaybeGetForPlacementId(
    const std::string& placement_id) const {
  DCHECK(!placement_id.empty());

  const auto iter = std::find_if(ads_.cbegin(), ads_.cend(),
                                 [&placement_id](const NotificationAdInfo& ad) {
                                   return ad.placement_id == placement_id;
                                 });
  if (iter == ads_.end()) {
    return absl::nullopt;
  }

  NotificationAdInfo ad = *iter;
  ad.type = AdType::kNotificationAd;
  return ad;
}

void NotificationAdManager::Add(const NotificationAdInfo& ad) {
  DCHECK(ad.IsValid());

  ads_.push_back(ad);

  if (kMaximumNotificationAds > 0 && ads_.size() > kMaximumNotificationAds) {
    AdsClientHelper::GetInstance()->CloseNotificationAd(
        ads_.front().placement_id);

    ads_.pop_front();
  }

  AdsClientHelper::GetInstance()->SetListPref(prefs::kNotificationAds,
                                              NotificationAdsToValue(ads_));
}

bool NotificationAdManager::Remove(const std::string& placement_id) {
  DCHECK(!placement_id.empty());

  const auto iter = std::find_if(ads_.cbegin(), ads_.cend(),
                                 [&placement_id](const NotificationAdInfo& ad) {
                                   return ad.placement_id == placement_id;
                                 });
  if (iter == ads_.end()) {
    return false;
  }

  ads_.erase(iter);

  AdsClientHelper::GetInstance()->SetListPref(prefs::kNotificationAds,
                                              NotificationAdsToValue(ads_));

  return true;
}

void NotificationAdManager::CloseAll() {
  for (const auto& ad : ads_) {
    AdsClientHelper::GetInstance()->CloseNotificationAd(ad.placement_id);
  }

  RemoveAll();
}

bool NotificationAdManager::Exists(const std::string& placement_id) const {
  DCHECK(!placement_id.empty());

  const auto iter = std::find_if(ads_.cbegin(), ads_.cend(),
                                 [&placement_id](const NotificationAdInfo& ad) {
                                   return ad.placement_id == placement_id;
                                 });

  if (iter == ads_.end()) {
    return false;
  }

  return true;
}

///////////////////////////////////////////////////////////////////////////////

void NotificationAdManager::Initialize() {
  const absl::optional<base::Value::List> list =
      AdsClientHelper::GetInstance()->GetListPref(prefs::kNotificationAds);
  if (!list) {
    return;
  }
  ads_ = NotificationAdsFromValue(*list);

  MaybeRemoveAll();
}

void NotificationAdManager::MaybeRemoveAll() {
#if BUILDFLAG(IS_ANDROID)
  if (WasBrowserUpgraded()) {
    // Android deletes notifications after upgrading an app, so we should remove
    // orphaned notification ads after a browser upgrade.
    RemoveAll();
  }
#endif  // BUILDFLAG(IS_ANDROID)
}

void NotificationAdManager::RemoveAll() {
  ads_.clear();

  AdsClientHelper::GetInstance()->SetListPref(prefs::kNotificationAds,
                                              NotificationAdsToValue(ads_));
}

}  // namespace ads
