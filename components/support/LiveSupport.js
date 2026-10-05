"use client";

import React, { useEffect, useState } from 'react';

const LiveSupport = ({ license }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // 如果没有 license 或者脚本已加载，不初始化
    if (!license || scriptLoaded) return;

    // 防止重复初始化
    if (window.LC_API || document.querySelector('script[src*="livechatinc.com"]')) {
      setScriptLoaded(true);
      return;
    }

    window.__lc = window.__lc || {};
    window.__lc.license = license;
    window.__lc.integration_name = "nextjs_app";

    const initLiveChat = () => {
      const script = document.createElement('script');
      script.async = true;
      script.type = 'text/javascript';
      script.src = 'https://cdn.livechatinc.com/tracking.js';
      
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => console.error('Failed to load LiveChat script');
      
      document.head.appendChild(script);
    };

    if (!window.__lc.asyncInit) {
      initLiveChat();
      window.LiveChatWidget = window.LiveChatWidget || { _q: [] };
    }
  }, [license, scriptLoaded]);

  // 如果没有 license，不渲染任何内容
  if (!license) {
    return null;
  }

  return (
    <div className="live-support-wrapper">
      <noscript>
        <a href={`https://www.livechat.com/chat-with/${license}/`} rel="nofollow">
          Chat with us
        </a>, powered by{' '}
        <a href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">
          LiveChat
        </a>
      </noscript>
    </div>
  );
};

export default LiveSupport;