//app/payment/razorpay/page.tsx

import { Suspense } from "react";
import RazorpayPage from "@/components/test";

export default function RazorpayWrapper() {
  return (
    <Suspense fallback={<p>Loading payment...</p>}>
      <RazorpayPage />
    </Suspense>
  );
}
