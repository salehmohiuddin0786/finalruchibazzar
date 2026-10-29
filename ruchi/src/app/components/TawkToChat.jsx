"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useAuth } from "../context/AuthContext.jsx";

export default function TawkToChat() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || typeof window === "undefined") return;

    const setVisitorDetails = () => {
      if (window.Tawk_API && typeof window.Tawk_API.setAttributes === "function") {
        const attributes = {};
        if (user.name) attributes.name = user.name;
        if (user.email) attributes.email = user.email;
        if (user.phone) attributes.phone = user.phone;

        if (Object.keys(attributes).length > 0) {
          window.Tawk_API.setAttributes(attributes, (error) => {
            if (error) console.warn("Tawk.to attribute set error:", error);
          });
        }
      }
    };

    if (window.Tawk_API) {
      if (window.Tawk_API.onLoad) {
        const prevOnLoad = window.Tawk_API.onLoad;
        window.Tawk_API.onLoad = function () {
          if (typeof prevOnLoad === "function") prevOnLoad();
          setVisitorDetails();
        };
      } else {
        window.Tawk_API.onLoad = setVisitorDetails;
      }
      setVisitorDetails();
    }
  }, [user]);

  return (
    <Script
      id="tawk-to-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/6ae37d7e11474f347101d63d/1k64a4dm2';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();
        `,
      }}
    />
  );
}
