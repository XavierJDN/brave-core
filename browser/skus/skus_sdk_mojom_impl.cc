// Copyright (c) 2021 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

#include "brave/browser/skus/skus_sdk_mojom_impl.h"

#include <memory>
#include <utility>

#include "brave/browser/skus/skus_sdk_service_factory.h"
#include "brave/components/skus/browser/skus_sdk_service.h"
#include "content/public/browser/browser_context.h"

namespace skus {

SkusSdkMojomImpl::SkusSdkMojomImpl(SkusSdkService* service)
    : service_(service) {}

SkusSdkMojomImpl::~SkusSdkMojomImpl() {}

void SkusSdkMojomImpl::RefreshOrder(const std::string& order_id,
                                    RefreshOrderCallback callback) {
  service_->RefreshOrder(order_id, std::move(callback));
}

void SkusSdkMojomImpl::FetchOrderCredentials(
    const std::string& order_id,
    FetchOrderCredentialsCallback callback) {
  service_->FetchOrderCredentials(order_id, std::move(callback));
}

void SkusSdkMojomImpl::PrepareCredentialsPresentation(
    const std::string& domain,
    const std::string& path,
    PrepareCredentialsPresentationCallback callback) {
  service_->PrepareCredentialsPresentation(domain, path, std::move(callback));
}

void SkusSdkMojomImpl::CredentialSummary(const std::string& domain,
                                         CredentialSummaryCallback callback) {
  service_->CredentialSummary(domain, std::move(callback));
}

}  // namespace skus
