import crypto from "node:crypto";

function md5(input: string): string {
  return crypto.createHash("md5").update(input).digest("hex").toUpperCase();
}

export interface PayHereOrder {
  orderId: string;
  amount: number;
  currency: string;
}

/**
 * PayHere's checkout hash: MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret)),
 * per PayHere's documented algorithm. Computed server-side only — the
 * merchant secret must never reach the browser.
 */
export function generatePayHereHash({
  orderId,
  amount,
  currency,
}: PayHereOrder): string {
  const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  if (!merchantId || !merchantSecret) {
    throw new Error("PayHere is not configured");
  }
  const amountFormatted = amount.toFixed(2);
  const hashedSecret = md5(merchantSecret);
  return md5(
    `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`,
  );
}

/** Verifies the md5sig PayHere sends to the notify_url webhook. */
export function verifyPayHereNotification(params: {
  merchant_id: string;
  order_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
}): boolean {
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  if (!merchantSecret) return false;

  const hashedSecret = md5(merchantSecret);
  const localSig = md5(
    `${params.merchant_id}${params.order_id}${params.payhere_amount}${params.payhere_currency}${params.status_code}${hashedSecret}`,
  );
  return localSig === params.md5sig;
}
