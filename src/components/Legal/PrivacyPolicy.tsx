import React from 'react';

interface LegalPageProps {
  isDarkMode: boolean;
  onPageChange: (page: string) => void;
}

const PrivacyPolicy: React.FC<LegalPageProps> = ({ isDarkMode, onPageChange }) => {
  return (
    <div className={`py-16 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Soil-Sync!</h2>
          <p className="mb-4">We value your privacy and want to be transparent about how we handle your data. This Privacy Policy explains what information we collect, how we use it, and the steps we take to protect it. We aim to use clear, friendly language so you can understand our practices.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data We Collect</h2>
          <p className="mb-4">When you use Soil-Sync, we collect certain information to provide and improve our service. This includes:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Soil and Agricultural Data:</strong> When you submit soil information for analysis, we collect data like temperature, humidity, moisture levels, soil type, crop type, and key nutrient levels (e.g., nitrogen, potassium, phosphorus). This data helps our AI provide tailored insights on soil health.</li>
            <li><strong>Account Information:</strong> If you sign up for an account, we ask for your full name and email address. These are stored securely in our database (we use Supabase as our storage and authentication service) to manage your login and send you any important account-related communication.</li>
            <li><strong>Contact Details for Results:</strong> If you choose to receive soil analysis results via SMS, we collect your phone number. We use a trusted service (Twilio) to send these text messages. Your number is only used for delivering results or alerts you’ve requested, and we won’t use it for marketing texts unless you explicitly opt-in.</li>
            <li><strong>Preferences and Usage Data:</strong> To make your experience better, we remember certain preferences. For example, if you prefer dark mode or light mode, that setting is saved in your browser’s local storage so the site can recall it next time. We may also collect basic usage data like your browser type or the pages you visit, which helps us improve Soil-Sync (for instance, by seeing which features are most used). This information is generally collected in a way that does not directly identify you, and it’s only used for making the app better.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
          <p className="mb-4">We use the collected data solely to operate and enhance the Soil-Sync service:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Providing AI Analysis:</strong> The core of Soil-Sync is our AI model that analyzes your soil data. We feed your submitted soil metrics into our machine learning system (hosted on Render, a cloud service that runs our AI models) to generate insights and suggestions for your agricultural needs. We only use your data to generate results for you – we do <strong>not</strong> use your soil data to profile you or for any purpose unrelated to giving you soil feedback.</li>
            <li><strong>Communicating Results and Updates:</strong> We use your contact info to send you what you requested. For instance, we’ll email you for account verification or password resets, and if you opted for SMS results, we’ll text your phone with the analysis outcome. We might also send occasional important updates about Soil-Sync (for example, changes to our service or policies), but we won’t flood your inbox or phone with marketing messages unless you’ve given us consent to do so.</li>
            <li><strong>Improving Our Service:</strong> Internally, we may analyze aggregated, anonymized data (so it’s not tied to your name or identity) to see how users generally use Soil-Sync. This could involve looking at overall usage patterns or common soil conditions being analyzed, which helps us refine our AI and user experience. For example, if many users have a particular soil type, we might train our model to give even better advice for that soil type. We do not sell your personal data to any third parties. Any analysis we do is to make Soil-Sync smarter and more helpful for you and all our users.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Services and Sharing</h2>
          <p className="mb-4">Soil-Sync integrates a few third-party services to function smoothly. We are careful about whom we work with and we only share the minimum data necessary with these providers:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Supabase:</strong> We use Supabase for our database and user authentication. That means your account info (like your name, email, and hashed password) and your saved soil entries are stored on Supabase’s systems. Supabase is a secure platform, and access to your data is restricted and protected. Supabase acts as our data host, but they do not use your data for their own purposes – it’s just stored and managed there on our behalf.</li>
            <li><strong>Twilio:</strong> If you opt to receive SMS results, we send your phone number and the text of your result to Twilio, which is a service that delivers SMS messages. Twilio is a reputable provider used by many applications. They will handle your phone number and message content only to the extent needed to send you the SMS. Twilio may temporarily log delivery details (e.g., whether an SMS was successfully delivered), but they have their own strict privacy and security practices. We do not share your phone number with anyone else, and we won’t use it beyond the SMS service you requested.</li>
            <li><strong>Render (AI Model Hosting):</strong> Our AI soil analysis runs on servers hosted by Render. When you submit data for analysis, that data is processed by our program running on Render’s infrastructure. Render might incidentally handle your data as part of providing the computing power (similar to how a cloud server provider would), but they do not access it in a meaningful way. We ensure that data sent to our model is transmitted securely. We also don’t permanently store your raw soil input on the AI server after the analysis is done – it’s used for the computation and then results are sent back to you.</li>
            <li><strong>No Social Media or Ad Tracking:</strong> We do not directly share your personal data with social media companies or advertisers. Soil-Sync does not use Facebook Pixel, Google Ads, or similar advertising trackers at this time. If this ever changes, we will update our policies and request any necessary consent. Our goal is to minimize your data exposure.</li>
            <li><strong>Legal Compliance:</strong> The only other scenario where we might share data is if we are required by law – for example, a court order could compel us to provide information. This is rare, and if it ever happens, we will only share what is legally necessary and will inform you if we are allowed to.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Local Storage</h2>
          <p className="mb-4">For user convenience, Soil-Sync uses cookies and similar technologies (like local storage in your web browser) to remember preferences and session info. For instance, when you log in, a token might be stored so you stay logged in, and your dark mode preference is kept in local storage so we recall it on future visits. These are small data files stored on your device that help make the site more user-friendly. We do <strong>not</strong> use these for advertising purposes, only for making the site functional and pleasant (like keeping you logged in or saving settings). For more details, see our dedicated <strong>Cookie Policy</strong> section below – it covers how cookies and local storage work and how you can manage them. (In short, the terms “cookies” in our policies include similar storage methods your browser provides, and the same information applies to local storage as to cookies.)</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data Security and Retention</h2>
          <p className="mb-4">We understand that your data is important to you, and we take precautions to keep it safe:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Security Measures:</strong> Soil-Sync employs industry-standard security practices to protect your personal information. This includes using encryption where appropriate (for example, our website uses HTTPS to encrypt data in transit, so your submissions aren’t intercepted). Sensitive information like passwords are never stored in plain text (they are hashed and salted). We restrict access to personal data – only authorized team members who need to support the service have access, and they are bound by confidentiality. Our third-party providers (Supabase, Twilio, Render) are also chosen in part for their strong security track records and compliance with data protection standards.</li>
            <li><strong>Data Retention:</strong> We retain your personal data only as long as necessary. Soil data that you submit may be stored in your account so you can review past results, until you delete it or request we delete it. Account information (like your email) is kept while you have an account with us. If you ever delete your account or request deletion of your data, we will remove personal data associated with you (except for any data we are required to keep for legal reasons, such as financial records or logs for security and compliance). We periodically review what data we have and delete or anonymize information that we no longer need. For example, if a user hasn’t logged in for a long time, we might reach out to ask if they want their data deleted or archive it in an anonymized form.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
          <p className="mb-4">It’s your data, and you have certain rights regarding it, especially if you are in a region with strong data protection laws (like the EU’s GDPR). We strive to honor these rights for all users:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Access and Correction:</strong> You have the right to know what personal data we hold about you. You can request a copy of your data, and we will provide it to you in a reasonable time frame. If any of your information is inaccurate or outdated (for instance, you change your email address), you have the right to correct or update it. Simply log in to your account settings to change some of your info, or contact us if you need assistance updating something specific.</li>
            <li><strong>Data Deletion:</strong> You can ask us to delete your personal data. For example, you can remove certain information via your account settings, and you may request that we erase the data we hold in our systems. If you want to close your account entirely, let us know and we will securely remove your account data (other than minimal records we might need to keep for legal/accounting purposes). Do note that if you ask for deletion of essential data (like your email which is tied to your login), we might not be able to continue providing service to you. But that’s your choice – we will respect it.</li>
            <li><strong>Consent and Opt-Out:</strong> Where we rely on your consent to use data, you have the right to withdraw that consent. For instance, if you initially opted in to get SMS messages or promotional emails, you can opt out later. Every marketing email (if we ever send one) will have an “unsubscribe” link. For SMS, you can contact us or follow provided instructions (such as replying “STOP” to opt out of texts, in accordance with messaging rules). For cookies and tracking, you can adjust your browser settings to refuse cookies or clear them – see our Cookie Policy below for how. Withdrawing consent won’t affect the lawfulness of any processing we already did, and it might mean we can’t provide some services (like we can’t send SMS results if you withdraw consent for using your phone number), but again, that’s up to you.</li>
            <li><strong>Data Portability:</strong> You have the right to get your data in a common format. If you need a copy of the soil data you’ve submitted or the analysis results, let us know – we can provide you with a file of your data so you can take it elsewhere or just have it for your records. We aim to use common formats (like CSV) that are easy to open.</li>
            <li><strong>Objection and Restrictions:</strong> You can object to certain types of data uses. For example, if we ever were to use your data for something like direct marketing (we currently do not), you can object to that and we will stop. You can also request that we restrict processing of your data in certain circumstances – for instance, if you contest the accuracy of some data, you can ask us to pause using it until it’s verified.</li>
            <li><strong>No Discrimination:</strong> We will never discriminate against you for exercising any of these privacy rights. Using your rights won’t result in any denial of service or different pricing – at most, it could impact our ability to serve you (for example, if you withdraw consent for essential things, we might not be able to provide that feature). But we will always try to accommodate your requests in good faith.</li>
          </ul>
          <p className="mb-4">If you have any questions or want to exercise any of these rights, you can contact us (see the Contact section at the end of these policies). We may need to verify your identity for security (so someone else doesn’t pretend to be you). For example, we might ask you to email from the address associated with your account or provide some identifying info. We’ll do our best to respond promptly and help with your request.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">AI and Privacy</h2>
          <p className="mb-4">Because Soil-Sync uses AI to analyze data, we want to clarify how that interacts with your privacy. The AI model looks at the soil data you provide and generates an output (recommendations or insights). We do not use this personal data to <strong>train</strong> our AI in a way that would retain your specific information. In other words, if we improve our model, we might look at many users’ soil inputs in aggregate, but not in a way that ties it to any individual. We also do not feed your personal soil reports into any public AI or third-party model for training purposes. The analysis happens dynamically: you give input, the model (which we built) processes it, and you get output. We aren’t building a profile of you personally. Also, any intermediate data (like the data sent to our AI on Render’s server for calculation) is not stored permanently with personally identifying info.</p>
          <p className="mb-4">We want you to feel secure using our AI features. If you ever have concerns about how the AI handles your data, please reach out. Transparency and trust are important to us, and we’re happy to explain more or make changes if needed to protect your privacy.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
          <p className="mb-4">As Soil-Sync grows and improves, we may update our Privacy Policy to reflect new features or changing regulations. If we make significant changes, we’ll notify users (for example, via email or a notice on the website). The “last updated” date will always be posted so you know if there’s a new version. Rest assured, we will not reduce your rights under this Privacy Policy without your consent. If changes are major, we might ask for consent again (for instance, if we ever wanted to use your data for a new purpose, which we currently do not). We encourage you to read this Privacy Policy from time to time to stay informed about how we’re protecting your information.</p>
          <p className="mb-4"><strong>In summary,</strong> your privacy is a priority for us. We collect only what we need to provide our service, we use it responsibly and carefully, and we give you control over your own data. Thank you for trusting Soil-Sync with your soil analysis needs!</p>
        </section>
        <div className="text-center mt-10">
          <button 
            onClick={() => onPageChange('LandingPage')}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 