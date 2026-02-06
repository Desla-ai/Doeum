'use client'

import { createClient } from '@/utils/supabase/browser'

export default function LogoutButton() {
  const onLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return <button onClick={onLogout}>로그아웃</button>
}
