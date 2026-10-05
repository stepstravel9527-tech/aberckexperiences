// utils/quickLogout.js
"use client";
import { signOut } from 'next-auth/react';

export async function quickLogout(options = {}) {
  try {
    await signOut({
      callbackUrl: "/welcome",
      redirect: true,
      ...options
    });
  } catch (error) {
    console.error('Sign out error:', error);
    throw error; // 抛出错误让调用方处理
  }
}