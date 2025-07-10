import React from 'react';

interface LegalPageProps {
  isDarkMode: boolean;
  onPageChange: (page: string) => void;
}

const DataProtection: React.FC<LegalPageProps> = ({ isDarkMode, onPageChange }) => {
  return (
    <div className={`py-16 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Data Protection
        </h1>

        <section className="mb-10">
          <p className="mb-4">At Soil-Sync, we are committed to protecting your data and respecting your privacy rights. This Data Protection section outlines our principles and practices regarding how we safeguard your personal information, comply with data protection laws, and ensure you remain in control of your data. Think of it as a summary of our commitment to data privacy and security, in line with regulations like the GDPR and others worldwide.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment to Your Privacy</h2>
          <p className="mb-4">Data protection isn’t just a checkbox for us – it’s a core part of how we build and operate Soil-Sync. We recognize that your personal data (like your name, email, and any contact info) and even your soil data belong to you, and we have a duty to handle them with care and integrity. Concretely, this means:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>We <strong>minimize</strong> the data we collect to only what’s necessary for the service (as detailed in our Privacy Policy).</li>
            <li>We <strong>limit use</strong> of your data to the purposes you’ve been informed about (and consented to, where applicable). We don’t use your personal data for any purpose that we haven’t disclosed to you.</li>
            <li>We <strong>do not sell</strong> your personal data. We also don’t share it with third parties for their own marketing purposes. Any third-party integration (Supabase, Twilio, etc.) is strictly a service provider role, using the data only to help us deliver the Soil-Sync functionality to you.</li>
            <li>We <strong>respect your rights</strong> over your data (detailed below). If you want to exercise any rights or have concerns, we’re here to help.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data Security Measures</h2>
          <p className="mb-4">Protecting data involves technical, administrative, and physical safeguards. Here are some key measures we take:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Encryption:</strong> Our site uses SSL/TLS (indicated by the `https://` in the URL) to encrypt data in transit. This means that the data you send to us (or we send to you) is encoded so that others on the network can’t easily read it. Additionally, for sensitive fields (like passwords), we apply encryption or hashing even in storage.</li>
            <li><strong>Secure Infrastructure:</strong> We host Soil-Sync on reputable platforms (for example, our database and authentication via Supabase, and our AI processing on Render). These providers maintain robust security practices, including physical security for data centers and regular security audits. We keep our systems up-to-date with security patches to protect against vulnerabilities.</li>
            <li><strong>Access Control:</strong> Internally, access to personal data is restricted to team members who <strong>need</strong> that access to perform their job (principle of least privilege). For instance, our development team might have access to the database for maintenance, but they will only access user data when necessary to troubleshoot an issue or fulfill a user request, and even then, they handle it confidentially. Administrative access to third-party services (Supabase, etc.) is protected with strong authentication (like two-factor authentication) to prevent unauthorized access.</li>
            <li><strong>Monitoring and Testing:</strong> We monitor our systems for any suspicious activity and have systems in place to detect anomalies (like unusual login patterns that could indicate unauthorized access). We also periodically test our own security (through code reviews, possibly security audits or penetration testing by professionals) to ensure our defenses are solid.</li>
            <li><strong>Data Backups:</strong> We perform regular backups of key data (like the database) to prevent loss in case of a hardware failure or other issue. These backups are encrypted and stored securely. In case of any incident, we have a plan to restore data and resume services as quickly as possible.</li>
            <li><strong>Employee Training:</strong> Everyone on the Soil-Sync team is educated about privacy and data protection. We discuss best practices and ensure that anyone handling user data understands how to do so safely and ethically.</li>
          </ul>
          <p className="mb-4">Despite all these measures, it’s important to note that no system can be 100% secure. However, we are committed to keeping up with best practices and improving our security over time. If there is ever a data breach that affects your personal data, we will notify you and the appropriate authorities as required by law, and we will act promptly to mitigate the impact.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
          <p className="mb-4">Soil-Sync is accessible around the world. Depending on where our servers are located (for example, if our database is hosted in a certain country) or where our third-party providers operate, your data might be transferred across international borders. We understand that different countries have different data protection laws (e.g., the European Union has GDPR).</p>
          <p className="mb-4">If you are located outside of the country where we process data, know that we take steps to ensure compliance with applicable legal requirements for data transfer. This may include using standard contractual clauses or other legal mechanisms to ensure that data is protected to EU standards even if stored in, say, the United States. By using Soil-Sync, you acknowledge that your data may be processed in countries different from your own, but always with robust protection measures in place (and in compliance with relevant laws).</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
          <p className="mb-4">We touched on your rights in the Privacy Policy, but let’s summarize them here as well, since data protection is all about empowering you with control:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Right to Access:</strong> You can ask us to confirm if we’re processing your personal data, and if so, request a copy of that data (commonly known as a Subject Access Request). We will provide you with the information we have about you, typically within a reasonable time frame.</li>
            <li><strong>Right to Rectification:</strong> If you see that any personal data we have is incorrect or incomplete, you have the right to have it corrected. The easiest way might be through your account profile (for basics like your name or email), but you can also contact us for help.</li>
            <li><strong>Right to Erasure:</strong> Also known as “the right to be forgotten.” You can request that we delete your personal data. Perhaps you’ve stopped using Soil-Sync and want your data wiped – just let us know. We will delete the data we have, barring any information we are required to keep (for example, if you made a purchase we might need to keep a record for tax purposes, or logs needed for security). But we’ll tell you if that’s the case. Generally, if you ask to be forgotten, we will remove your personal info from our active systems and backups will eventually cycle out that data too. We respect your choice.</li>
            <li><strong>Right to Withdraw Consent:</strong> If you gave consent for something (like receiving newsletters or using certain cookies), you can withdraw that consent at any time. We make it easy – an “unsubscribe” link on emails, options in your profile, or you can always email us. Once you withdraw consent, we will stop the processing that was based on consent.</li>
            <li><strong>Right to Object:</strong> You can object to our processing of your data if you believe we don’t have the right to do so. For instance, if we were sending marketing emails under a “legitimate interest” basis, you could object and we would stop. Currently, we don’t do much of any marketing, but this right also applies to things like data science – if you object to us including your anonymized data in aggregate statistics, we’ll consider and respect such requests if feasible.</li>
            <li><strong>Right to Restrict Processing:</strong> In certain cases, you can ask us to temporarily limit how we use your data. For example, if you contest the accuracy of data, you might want to restrict processing until we verify or update it. Or if you have an objection pending, you can ask us to hold off on other processing in the meantime. We’ll flag your data and ensure it’s not used in those ways during the restriction period.</li>
            <li><strong>Right to Data Portability:</strong> You can request that we provide your personal data in a structured, commonly used, machine-readable format (like a CSV file), and you have the right to send that data to another service. If technically feasible, you can also ask us to transfer it directly to another provider. This is useful if you want to take your data to a different platform. (This typically applies to data you provided, and that we process by automated means.)</li>
            <li><strong>Right not to be Subject to Automated Decisions:</strong> Soil-Sync’s AI provides recommendations, but we do not make any legally significant decisions about you solely by algorithms. This right is more relevant if, for example, a service was automatically approving or rejecting something like a loan without human involvement. In our case, the AI is giving suggestions about soil; there’s no automated decision that affects your legal status or rights. However, we mention this for completeness – you have a right to request human intervention or to contest decisions if a computer were making important calls about you.</li>
            <li><strong>Right to Complain:</strong> If you believe your data rights have been violated or that we’re not complying with our obligations, you have the right to lodge a complaint with a supervisory authority (like a Data Protection Authority in your country). We would appreciate the chance to address your concerns directly first, but you absolutely have the right to escalate to authorities. For EU users, this would typically be the agency in your country. For example, in the UK it’s the ICO, in France the CNIL, etc. In any case, we’re fully committed to resolving issues in a fair and transparent manner.</li>
          </ul>
          <p className="mb-4">We will not charge you for exercising these rights (they are free), unless a request is unfounded or excessive (in which case we might charge a reasonable fee or refuse, but we’d have to justify that). When you make a request, we might ask for certain information to verify your identity – this is to ensure we don’t disclose your data to someone else. For instance, if you email us from the address on file, that helps, but if an imposter emailed claiming to be you, we’d have a problem – so we might have a verification step.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Data Retention Policy</h2>
          <p className="mb-4">We keep personal data only for as long as necessary to fulfill the purposes for which we collected it, including any legal or reporting requirements. In practice, this means:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Account Data:</strong> As long as you have an active account, we keep the data associated with it. If you become inactive for a long period, we might reach out to confirm if you want to retain your account. If you delete your account or request deletion, we will remove personal data, usually within \[a short period, e.g., 30 days] of the request. Some data might persist slightly longer in backups, but those are protected and eventually deleted as the backups cycle.</li>
            <li><strong>Soil Analysis Data:</strong> Data you submit for analysis might be stored in your account history so you can review past results. If you delete a particular soil test entry, we remove that data from our main database. Aggregated stats that include that data (with no personal identifiers) might remain in our analytics, but they won’t be linked to you. If you delete your account, all soil analysis entries linked to your account will be deleted too.</li>
            <li><strong>Communication Data:</strong> If you contacted support or we sent you service emails, those records may be stored for a time (for instance, we keep customer support emails to have context on past issues, and to improve our service). But we protect those communications as well, and they’re only accessible to our support team.</li>
            <li><strong>Legal Obligations:</strong> We might keep some data if required for legal compliance. For example, if there were any financial transactions, we’d retain records for accounting and tax purposes for the period required by law. Or if we needed to keep logs for security (to investigate abuse or a breach), we’d retain those logs until resolved. In all cases, such data would be kept only for the required duration and then deleted or anonymized.</li>
          </ul>
          <p className="mb-4">After the retention period, we either delete the data or anonymize it (so it can no longer be associated with you). Anonymized data may be used for statistical purposes indefinitely without further notice to you, since it’s no longer personal data.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Compliance with Laws (GDPR, etc.)</h2>
          <p className="mb-4">We strive to comply with all applicable data protection laws. This includes GDPR for users in the European Economic Area (EEA), the UK’s data protection laws, and other similar regulations around the world (like CCPA in California, etc.). Some key points:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>We base our data processing on valid legal grounds. Usually, the legal bases are: <strong>Consent</strong> (e.g., you opted in to SMS or marketing, or accepted cookies), <strong>Contract</strong> (e.g., when you sign up, we have an agreement to provide the service, so we process data to fulfill that contract), <strong>Legitimate Interests</strong> (e.g., improving our service or ensuring security – we balance this against your rights), and sometimes <strong>Legal Obligation</strong> (e.g., keeping records for law). If we ever were to process sensitive personal data (which we generally do not, since soil data is not personal data), we’d ensure to have explicit consent or other required basis.</li>
            <li>We have a privacy policy (above) that details our practices, fulfilling transparency requirements. We encourage you to read it – after all, you’re already here!</li>
            <li>If we ever need to appoint a Data Protection Officer or EU Representative for compliance, we will make that information available. As a smaller service, we might not be legally required to have a DPO, but we do have people responsible for privacy matters.</li>
            <li><strong>Children’s Data:</strong> As mentioned in Terms, our service isn’t directed to children under 13. We don’t knowingly collect personal data from them. If a child under 13 has provided us personal info, a parent/guardian can contact us to delete it. We comply with COPPA (Children’s Online Privacy Protection Act in the US) and similar laws. For teens older than 13 but under the age of majority, we treat their data much like any user’s, but if we learn someone is under 16 in the EU, for example, we’d require parental consent verification per GDPR rules, or otherwise not process their personal data. We just mention this to show we are mindful of protecting minors’ information.</li>
            <li><strong>Data Protection by Design:</strong> We incorporate privacy considerations into our development process. Whenever we add a new feature, we think about what data it will use and how to minimize personal data usage. We conduct privacy reviews to ensure that we maintain a high standard of data protection throughout the app’s lifecycle.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Contact and Further Information</h2>
          <p className="mb-4">If you have any questions, concerns, or requests regarding data protection at Soil-Sync, please contact us at <strong>support@soil-sync.com</strong>. We are happy to provide additional details or assist you in exercising your rights. Reaching out to us doesn’t cost anything, and we’ll do our best to address your inquiry as promptly and thoroughly as possible.</p>
          <p className="mb-4">You also have the right to contact your local data protection authority if you believe we have infringed your rights. However, we truly hope to resolve any issue directly with you in a satisfying way. Your trust is extremely important to us.</p>
          <p className="mb-4"><strong>In summary,</strong> this Data Protection section underscores that we take your privacy seriously. We use robust security practices to guard your data, adhere to privacy laws, and give you control over what happens with your information. Soil-Sync’s mission is to help you with soil insights, and we are committed to doing that in a way that respects and protects your personal data at every step. Thank you for trusting Soil-Sync, and rest assured that your data protection is in good hands with us.</p>
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

export default DataProtection; 