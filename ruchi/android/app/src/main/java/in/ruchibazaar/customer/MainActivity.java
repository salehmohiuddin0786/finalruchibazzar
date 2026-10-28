package in.ruchibazaar.customer;

import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);

                // Allow cookies and third-party cookies for Firebase authentication
                CookieManager cookieManager = CookieManager.getInstance();
                cookieManager.setAcceptCookie(true);
                cookieManager.setAcceptThirdPartyCookies(webView, true);

                // Clean User-Agent so Google OAuth does not block with 'disallowed_useragent'
                String customUA = settings.getUserAgentString();
                if (customUA != null) {
                    customUA = customUA.replace("; wv", "").replaceAll("Version\\/\\d+\\.\\d+\\s*", "");
                    settings.setUserAgentString(customUA);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

