import React from 'react';

interface LegalPageProps {
  isDarkMode: boolean;
  onPageChange: (page: string) => void;
}

const CookiePolicy: React.FC<LegalPageProps> = ({ isDarkMode, onPageChange }) => {
  return (
    <div className={`py-16 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <button
            onClick={() => onPageChange('Dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            ← Back to Home
          </button>
        </div>

        <section className="mb-10">
          <p className="mb-4">This Cookie Policy explains how Soil-Sync uses “cookies” and similar technologies to recognize you when you visit our website. We want to make these details as simple and transparent as possible. By using our site, you agree to the use of cookies and local storage as described here. However, you have choices to control or disable them, which we’ll also explain below.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">What Are Cookies (and Local Storage)?</h2>
          <p className="mb-4">Cookies are small text files that websites save on your device (computer, smartphone, etc.) when you browse. They contain bits of information – for example, a site might use a cookie to remember that you’re logged in, or what language you prefer. Cookies make your browsing experience easier and more personalized by remembering your preferences and actions over time. They <strong>do not</strong> damage your device, and they can be read back by the website that set them (or sometimes by other services that the website uses).</p>
          <p className="mb-4">In addition to cookies, modern web browsers also provide <strong>local storage</strong> and session storage, which allow websites to store information directly in your browser. Soil-Sync uses local storage for certain things like remembering your dark mode/light mode preference. For purposes of privacy and simplicity, when we say “cookies” in this policy, we’re including similar technologies like local storage that serve the same purpose. The key difference is that local storage data stays in your browser and isn’t sent automatically with every web request (unlike cookies which are sent to the server), but it’s still data stored on your device that you have control over.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
          <p className="mb-4">Soil-Sync uses cookies and local storage to improve your experience. Here are the types of storage we use and what they do:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Essential Cookies:</strong> These are necessary for the website to function. For example, when you log in, we might use a secure cookie or local storage token to keep you logged in as you navigate between pages. Without this, you’d have to re-enter your credentials for every action. Essential cookies might also help with site security (ensuring that you’re actually the one making requests from your account). We do not require explicit consent for these essential cookies, because the site wouldn’t work properly without them.</li>
            <li><strong>Preference Cookies/Local Storage:</strong> These remember your choices to give you a more personalized experience. A prime example is the dark mode setting. If you select dark mode, we store that preference (usually in local storage) so that the next time you visit, the site is already in dark mode for you. Similarly, if the app supports multiple languages or other customizable features, a cookie/local storage entry might remember what you chose last time. These items exist purely to make your life easier and save you from having to re-set preferences each visit.</li>
            <li><strong>Analytics Cookies:</strong> Currently, Soil-Sync’s focus is providing the AI service, and we do not use any intrusive analytics cookies that track your every move. However, we may in the future use a very basic analytics tool (like one that doesn’t collect personal data or that self-hosts analytics) to understand how many people use our service and which features are popular. If we do this, we will update this section. Such analytics might use cookies to distinguish between new and returning visitors, for example. If any analytics cookies are non-essential, we will ask for your consent before enabling them.</li>
            <li><strong>No Third-Party Advertising Cookies:</strong> We do <strong>not</strong> use third-party advertising cookies or tracking pixels. That means you won’t see Soil-Sync trying to show you ads, nor are we profiling you for advertising purposes. You also shouldn’t see ads from others on our site. In the event we ever partner with third parties that set cookies (for example, a different service integrated into our site), we will clearly let you know and typically such cookies would require your consent. As of now, the only third-party-related cookies might come from our integration providers (Supabase auth or Twilio widget if any) but those would be solely for the functioning of that service (like verifying your login or sending an SMS), not for advertising.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Consent and Control</h2>
          <p className="mb-4">When you first visited Soil-Sync, you may have seen a banner or notice about cookies (depending on legal requirements in your region). We want you to have control over your data, so we provide ways to manage cookies:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Browser Settings:</strong> Most web browsers allow you to manage cookies and local storage through their settings. You can usually block all cookies, allow only certain types, or delete cookies when you close your browser. You can likewise usually clear local storage data. If you want to prevent cookies from being used, you can adjust your browser settings to refuse new cookies, and you can delete existing cookies. You can also use your browser’s developer tools or settings to clear local storage for a site. Keep in mind, if you disable cookies/local storage for Soil-Sync, some features (like staying logged in or remembering preferences) might not work properly. For example, if you block the login cookie, our site may not recognize that you are logged in and you won’t be able to use your account.</li>
            <li><strong>Opting Out of Non-Essential Cookies:</strong> If we ever introduce cookies that are not strictly necessary (like certain analytics or any future features), we will provide a mechanism for you to opt out or opt in. This could be through the cookie banner preferences or an account setting. We will honor Do-Not-Track signals if feasible, and we will not load non-essential cookies for users who opt out.</li>
            <li><strong>Cookie Banner:</strong> In jurisdictions that require it, we use a cookie consent banner when you first visit, which clearly states what cookies we use and asks for your consent for any that are not strictly needed. You are free to decline those. The banner will also link to this Cookie Policy for more details. Once you’ve set your preferences, the banner typically won’t reappear unless we significantly change our cookie usage or if a long time has passed.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Cookies We Set (Examples)</h2>
          <p className="mb-4">For transparency, here are some examples of cookies or local storage entries Soil-Sync might set and their purpose:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><code>soilSyncSession</code> (cookie or local storage): <strong>Purpose:</strong> Keeps you logged in during your session. <strong>Type:</strong> Essential. <strong>Lifetime:</strong> Possibly a few hours or until you log out (or a few weeks if “Remember me” is checked).</li>
            <li><code>soilSyncTheme</code> (local storage): <strong>Purpose:</strong> Remembers if you prefer dark mode or light mode. <strong>Type:</strong> Preference. <strong>Lifetime:</strong> Until you clear local storage or change the preference (it has no expiration by default).</li>
            <li><code>soilSyncAnalytics</code> (cookie): <strong>Purpose:</strong> (Only if we implement analytics) to differentiate users for counting visits (for example, to tell if one person visited 5 times vs 5 people visited once). This might just be a random ID. <strong>Type:</strong> Non-essential (requires consent if used). <strong>Lifetime:</strong> Maybe 1 month or so, to track repeat visits over a short period.</li>
            <li>Third-party cookies: If you log in via a third-party (for example, if someday we allowed Google login or similar), those providers might set cookies to facilitate that login. Similarly, if an embedded map or video was on our site, that third-party might set cookies. We currently don’t have such features, but we’ll update our policy and notify you if that changes.</li>
          </ul>
          <p className="mb-4">We try to keep the number of cookies to a minimum and their duration reasonable. We do not use cookies to collect sensitive personal information like passwords or credit card numbers – those are handled through secure forms and not stored in cookies.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Managing Cookies & Local Storage</h2>
          <p className="mb-4">You are in control. Here’s how you can manage or delete cookies and local data:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Via Browser</strong><span className="ml-1">: As mentioned, check your browser’s settings (often under Privacy or Security) for options to manage cookies. You can delete cookies for a single site or all sites. You can also clear local storage via your browser’s developer tools or settings. Some browsers allow setting exceptions – for example, blocking third-party cookies or allowing cookies only for specific trusted sites. For more detailed control, there are browser extensions that can manage cookies for you as well.</span></li>
            <li><strong>After Deletion</strong><span className="ml-1">: If you delete Soil-Sync cookies or local storage data, please note you might need to log in again or re-set preferences. For instance, if you clear the dark mode setting, the site will go back to default mode (light or dark) on your next visit until you choose again. If you clear the session cookie while logged in, you might be logged out and need to sign in next time.</span></li>
            <li><strong>Do Not Track</strong><span className="ml-1">: Soil-Sync honors “Do Not Track” signals to the best of our ability. If your browser is set to Do Not Track, we will not load any non-essential tracking scripts. However, essential functionality will still use cookies or equivalents because it’s necessary for the service.</span></li>
            <li><strong>Getting Help</strong><span className="ml-1">: If you’re not sure how to manage cookies, here are some general tips: In Chrome or Edge, you can usually find cookie settings under Settings &gt; Privacy and Security &gt; Cookies and site data. In Safari, go to Preferences &gt; Privacy. In Firefox, see Options &gt; Privacy &amp; Security &gt; Cookies and Site Data. You can search online for “manage cookies in [Your Browser Name]” for up-to-date instructions.</span></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Cookie Policy Updates</h2>
          <p className="mb-4">We may update this Cookie Policy if we change what cookies or similar technologies we use. Significant changes will likely be communicated via a notice on our site or via the cookie banner (which might reappear to get consent for new uses). We encourage you to review this policy from time to time to stay informed about how we use these technologies.</p>
          <p className="mb-4">By continuing to use Soil-Sync, you consent to our use of cookies and local storage as described here (unless you have disabled them via your browser or declined via our prompts). We appreciate your understanding, and we hope the cookies make your experience smoother! If you have any questions about our use of cookies, feel free to reach out.</p>
        </section>
        <div className="text-center mt-10">
          
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy; 