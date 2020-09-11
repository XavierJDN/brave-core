/* Copyright (c) 2019 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_UTILITY_BRAVE_CONTENT_UTILITY_CLIENT_H_
#define BRAVE_UTILITY_BRAVE_CONTENT_UTILITY_CLIENT_H_

#include <string>

#include "chrome/utility/chrome_content_utility_client.h"
#include "mojo/public/cpp/bindings/pending_receiver.h"

class BraveContentUtilityClient : public ChromeContentUtilityClient {
 public:
  BraveContentUtilityClient();
  ~BraveContentUtilityClient() override;

  bool HandleServiceRequest(
      const std::string& service_name,
      mojo::PendingReceiver<service_manager::mojom::Service> receiver) override;

 private:
  DISALLOW_COPY_AND_ASSIGN(BraveContentUtilityClient);
};

#endif  // BRAVE_UTILITY_BRAVE_CONTENT_UTILITY_CLIENT_H_
