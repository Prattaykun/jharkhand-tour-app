//app/payment/razorpay/page.tsx

import { Suspense } from "react";
import RazorpayPage from "@/app/test/page";

export default function RazorpayWrapper() {
  return (
    <Suspense fallback={<p>Loading payment...</p>}>
      <RazorpayPage />
    </Suspense>
  );
}
