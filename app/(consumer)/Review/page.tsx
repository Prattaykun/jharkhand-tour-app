// app/reviews/page.tsx
'use client';
import ConsumerReview from '@/components/consumer/ConsumerReview';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
const ReviewPage = () => {
  const [user, setUser] = useState<User | null>(null);

  

  return <ConsumerReview user={user} supabase={supabase} />;
};

export default ReviewPage;
