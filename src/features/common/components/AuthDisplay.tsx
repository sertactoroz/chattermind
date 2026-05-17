'use client';

import React from 'react';
import { useAuthContext } from '@/features/auth/context/AuthProvider';
import AvatarMenu from '@/features/common/components/AvatarMenu';

export default function AuthDisplay() {
  const { user, loading } = useAuthContext();

  if (loading || !user) {
    return null;
  }

  const avatarUrl = user.avatarUrl;
  const fullName = user.fullName ?? user.email;

  return (
    <div className="flex items-center gap-3 ring-2 ring-brand/40 border-1 border-background hover:ring-brand/50 rounded-full">
      <AvatarMenu userAvatar={avatarUrl} fullName={fullName} />
    </div>
  );
}
