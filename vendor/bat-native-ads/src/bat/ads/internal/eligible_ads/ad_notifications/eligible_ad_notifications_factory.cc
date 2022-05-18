/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "bat/ads/internal/eligible_ads/ad_notifications/eligible_ad_notifications_factory.h"

#include "bat/ads/internal/eligible_ads/ad_notifications/eligible_ad_notifications_base.h"
#include "bat/ads/internal/eligible_ads/ad_notifications/eligible_ad_notifications_v1.h"
#include "bat/ads/internal/eligible_ads/ad_notifications/eligible_ad_notifications_v2.h"
#include "bat/ads/internal/resources/behavioral/anti_targeting/anti_targeting_resource.h"
#include "bat/ads/internal/serving/targeting/geographic/subdivision/subdivision_targeting.h"

namespace ads {
namespace ad_notifications {

std::unique_ptr<EligibleAdsBase> EligibleAdsFactory::Build(
    const int version,
    targeting::geographic::SubdivisionTargeting* subdivision_targeting,
    resource::AntiTargeting* anti_targeting_resource) {
  switch (version) {
    case 1: {
      return std::make_unique<EligibleAdsV1>(subdivision_targeting,
                                             anti_targeting_resource);
    }

    case 2: {
      return std::make_unique<EligibleAdsV2>(subdivision_targeting,
                                             anti_targeting_resource);
    }

    default: {
      return nullptr;
    }
  }
}

}  // namespace ad_notifications
}  // namespace ads
