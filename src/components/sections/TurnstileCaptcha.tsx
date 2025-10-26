// src/components/TurnstileCaptcha.tsx
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileCaptchaProps {
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  siteKey: string;
  theme?: "light" | "dark" | "auto";
}

const TurnstileCaptcha: React.FC<TurnstileCaptchaProps> = ({
  onVerify,
  onError,
  onExpire,
  siteKey,
  theme = "auto",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load script only once
    const loadScript = () => {
      if (window.turnstile) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    };

    loadScript();
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    // Clean up previous widget
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.remove(widgetIdRef.current);
    }

    // Render new widget
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: theme,
      callback: onVerify,
      "error-callback": onError,
      "expired-callback": onExpire,
    });

    // Cleanup on unmount
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [isLoaded, siteKey, theme, onVerify, onError, onExpire]);

  const resetCaptcha = () => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-20 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-gray-500">Loading captcha...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div ref={containerRef} className="turnstile-widget" />
      <button
        type="button"
        onClick={resetCaptcha}
        className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Reset verification
      </button>
    </div>
  );
};

export default TurnstileCaptcha;
