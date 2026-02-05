'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the tasks page as the default dashboard view
    router.push('/dashboard/tasks');
  }, [router]);

  return null; // Render nothing since we're redirecting
}