"use client";

import { HelperOnlineCard } from "./HelperOnlineCard";
import { IncomingRequestsPreview } from "./IncomingRequestsPreview";
import { RecommendedRequestsPreview } from "./RecommendedRequestsPreview";

export function HelperHomePanel() {
  return (
    <div className="space-y-4">
      <HelperOnlineCard />
      <IncomingRequestsPreview />
      <RecommendedRequestsPreview />
    </div>
  );
}
