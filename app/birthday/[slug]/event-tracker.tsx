"use client";

import { useEffect, useRef } from "react";

/**
 * Fires a fire-and-forget "opened" event once per page load. The template
 * itself calls the same /api/events endpoint for finer-grained events
 * (gift_opened, message_viewed, etc.) via its onEvent callback — this
 * component only guarantees the initial "opened" ping even if the visitor
 * never interacts further.
 */
export function BirthdayEventTracker({ surpriseId }: { surpriseId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surpriseId, eventType: "opened" }),
      keepalive: true,
    }).catch(() => {
      // Analytics failures should never block or degrade the recipient's experience.
    });
  }, [surpriseId]);

  return null;
}
