import React from 'react';

interface LegalPageProps {
  isDarkMode: boolean;
  onPageChange: (page: string) => void;
}

const TermsOfService: React.FC<LegalPageProps> = ({ isDarkMode, onPageChange }) => {
  return (
    <div className={`py-16 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Terms of Service
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
          <h2 className="text-2xl font-semibold mb-4">Using Soil-Sync</h2>
          <p className="mb-4">Soil-Sync is a web application that uses artificial intelligence to analyze agricultural soil data and provide insights. By accessing or using Soil-Sync, you confirm that you accept these Terms and will follow them. If you don’t agree with these Terms, please refrain from using the app.</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Eligibility:</strong> Our app is meant for users who are 13 years or older. If you are under 13, you shouldn’t use Soil-Sync or provide personal information. If you are between 13 and 18 (or the age of legal majority in your country), you should only use the app with the supervision and consent of a parent or guardian who agrees to these Terms on your behalf.</li>
            <li><strong>Your Account:</strong> To get the most out of Soil-Sync, you might create an account (with your name and email). Keep your login credentials (especially your password) confidential. You’re responsible for any activity that happens under your account, so please use a strong password and do not share it. If you suspect unauthorized use of your account, notify us immediately so we can help secure it. You must provide accurate information when creating an account – don’t impersonate someone else or give false details. And please keep your account info up to date (especially your contact info) so we can reach you if needed.</li>
            <li><strong>User Conduct:</strong> We ask that you use Soil-Sync in a lawful and respectful manner. You agree <strong>not</strong> to misuse the service. For example, you should not:
              <ul className="list-circle list-inside ml-5 space-y-1 mt-2">
                <li>Violate any laws or regulations while using our app (for instance, don’t use Soil-Sync to do anything fraudulent or to assist in illegal farming activities).</li>
                <li>Attempt to hack, disrupt, or impair the operation of Soil-Sync. This means no introducing malware, no denial-of-service attacks, and no trying to access systems or data you are not authorized to access.</li>
                <li>Reverse engineer or decompile our software, or use automated systems (like bots or scrapers) to extract data from Soil-Sync, except as allowed by law or with our prior written permission.</li>
                <li>Submit content that is harmful, offensive, or violates anyone’s rights. For example, do not input data that contains someone else’s personal information without consent, and don’t use any part of our service to harass, spam, or deceive others. (Note: Soil data itself typically isn’t personal information, but just in case – avoid including any personal identifiers in any data entries or queries.)</li>
                <li>Use the service in a way that could damage, disable, or overburden our infrastructure. Our AI model is there to help with soil analysis, so please don’t try to overwhelm it with unreasonable requests or exploit it in ways not intended.</li>
              </ul>
            </li>
          </ul>
          <p className="mb-4">We reserve the right to suspend or terminate your access to Soil-Sync if we believe you are not following these rules or if you engage in behavior that harms other users, our service, or violates the spirit of these Terms. We’d prefer not to do that, so please keep things friendly and lawful!</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">AI-Based Advice and Disclaimers</h2>
          <p className="mb-4">Soil-Sync provides insights and suggestions based on an AI analysis of the data you provide. We strive to make these insights accurate and useful, but it’s very important to understand that <strong>AI-generated advice is not guaranteed to be correct or exhaustive</strong>. The service (and the AI outputs) are provided on a best-effort basis, <strong>without any guarantee of accuracy or reliability</strong>. Here’s what that means for you:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>No Professional Advice:</strong> The insights from Soil-Sync should <strong>not</strong> be considered a substitute for professional agricultural or soil science advice. While we hope our AI can point you in the right direction (e.g., suggest nutrient adjustments or irrigation tips), it cannot account for every real-world variable. Always use your own judgement and consider consulting with a qualified agronomist or local agriculture extension service for critical decisions. Think of Soil-Sync as a helpful assistant, but not an infallible expert.</li>
            <li><strong>No Guarantee of Accuracy:</strong> We work hard to train our AI model with relevant data, but we <strong>do not guarantee</strong> that every recommendation or piece of information it provides is 100% accurate or up-to-date. There are many factors in agriculture that our model might not fully capture, and sometimes the AI might make a mistake or a suggestion that doesn’t fit your unique situation. Use the results as guidance, not gospel.</li>
            <li><strong>User Responsibility for Decisions:</strong> Any actions you take based on the app’s results are your own responsibility. Soil-Sync will not be liable if, for example, you apply a certain fertilizer based on our suggestion and don’t get the outcome you expected. Always double-check important actions. If the AI suggests something extreme or costly, it’s wise to cross-verify with an expert or another source before proceeding.</li>
            <li><strong>Service Provided “As Is”:</strong> Soil-Sync is an evolving technology. You understand that the service is provided “as is” and “as available”. We make no warranty that the service will be uninterrupted or error-free, or that it will meet your needs to any particular standard (though we certainly aim for it to be helpful!). We also can’t promise that any content (including your data or results) won’t be lost, though we have backups and protections in place. In short, by using Soil-Sync, you accept that there may be some risks and imperfections with an AI service — we’ll do our best to minimize them, but they can’t be completely eliminated.</li>
            <li><strong>Experimental Nature of AI:</strong> Artificial intelligence for soil analysis is a new and complex field. By using Soil-Sync, you acknowledge that this is somewhat experimental. The AI’s suggestions are based on patterns and data, but it might occasionally produce results that are odd or not useful. If you encounter something that seems off, you can contact us and we’ll look into it. We are always improving the AI, and your feedback helps.</li>
            <li><strong>No Bias or Harm Intended:</strong> Our AI should only be focusing on agricultural data. It doesn’t consider personal attributes like race, gender, etc., and it shouldn’t produce content that is offensive or biased. If you ever feel a result was inappropriate, let us know. We do not endorse any offensive or irrelevant output the AI might generate – again, it’s a tool and not a reflection of any opinion or endorsement by Soil-Sync or our team.</li>
          </ul>
          <p className="mb-4">In summary, <strong>use Soil-Sync’s advice at your own risk</strong>. We’re here to support your farming decisions, but we can’t take responsibility for those decisions. Always pair AI insights with your own expertise and local conditions.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property and Content</h2>
          <p className="mb-4">We need to talk about who owns what when you use Soil-Sync:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Your Data is Yours:</strong> When you input your soil data or any content into Soil-Sync, you retain ownership of that data. If you upload or provide any content (like a description or notes about your soil), you own it. By providing it to Soil-Sync, you are granting us a license to use it <strong>only</strong> for the purposes of providing the service to you. That means we can process it, analyze it, and store it as needed to give you results, and for improving our service as described in the Privacy Policy. We do not claim ownership of your personal data or the specific soil data you provide. If you delete your data or account, that license ends (except any residual backups which will be deleted periodically).</li>
            <li><strong>Output/Results:</strong> The results and analysis generated by the AI (the output) are provided to you. You are free to use these results for your own purposes (e.g., farming decisions, research, etc.). Note that the output is generated based on your input and our AI. While we have rights in the AI model itself, we do not claim ownership of the specific text or recommendations it produces for you. So feel free to download, share, or even print your Soil-Sync report for your crops. We do appreciate attribution if you share the insights publicly (like “This analysis was assisted by Soil-Sync AI”), but that’s not a requirement, just a friendly request.</li>
            <li><strong>Soil-Sync Content:</strong> Everything that is part of the Soil-Sync service (outside of what users submit) is owned by us or our licensors. This includes the software code, the design and interface of the website, our logos and trademarks, the AI model and algorithms, and any text or illustrations on our site that we wrote or created. These are protected by intellectual property laws. You agree not to copy, distribute, or create derivative works from our proprietary content without permission. For example, you can’t take our code or database and make a clone service, and you shouldn’t use our brand name in a confusing way. If you’re a researcher or developer and interested in our tech, contact us – maybe we can collaborate, but please don’t infringe on our rights.</li>
            <li><strong>Feedback:</strong> If you choose to provide feedback or suggestions on how to improve Soil-Sync, you agree that we can use that feedback freely to improve our product. We consider feedback to be given voluntarily. While you might have a brilliant idea that helps us, you won’t be entitled to compensation or ownership of any improvements made based on your suggestions. (In lawyer language: feedback is provided without any obligation of confidentiality or compensation, and we can use it and incorporate it into Soil-Sync without any duties to you.)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p className="mb-4">We sincerely hope Soil-Sync is useful and works flawlessly, but as with any service, there can be hiccups. Therefore, we need to limit our liability to you:</p>
          <p className="mb-4">To the fullest extent allowed by law, Soil-Sync and its creators (and affiliates, partners, etc.) will <strong>not be liable</strong> for any indirect damages or losses that result from your use of (or inability to use) our service. This includes things like lost profits, lost crops, loss of data, or damage to equipment, even if we’ve been advised those things are possible. We’re also not liable for any outcome from following AI recommendations – as mentioned, use them with caution and at your own risk.</p>
          <p className="mb-4">If, notwithstanding the above, we are found liable for something, the maximum damages we would pay is limited to the amount you have paid us for the service (in most cases Soil-Sync may be free or have a subscription; if you haven’t paid anything, then we owe nothing in damages). Again, this is only if such limitations are permissible under the law – some regions don’t allow certain liability limitations, in which case this section would be adjusted for those jurisdictions.</p>
          <p className="mb-4">Remember, we don’t control the environment or how you use the advice. If the AI suggests watering your plants more and then there’s an unexpected rainstorm, we can’t be responsible for an outcome that was caused by factors outside our service.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
          <p className="mb-4">You agree that, to the extent permitted by law, you will indemnify (defend and hold harmless) Soil-Sync and its team from any claims, liabilities, or expenses (including reasonable attorneys’ fees) that arise from your misuse of the service or violation of these Terms. In plain language, if you do something illegal or harmful using Soil-Sync, and it causes us to get sued or incur costs, you’ll help cover those costs. This would also apply if you share content through Soil-Sync that infringes someone’s rights and they pursue action against us. We are not looking for trouble, and we assume you aren’t either – this is just a standard clause to protect our project in worst-case scenarios.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Changes to the Service and Terms</h2>
          <p className="mb-4">Soil-Sync is an evolving platform. We may add, change, or remove features over time. We reserve the right to modify or discontinue (temporarily or permanently) the service or any part of it with or without notice. We hope to always offer Soil-Sync, but things happen – for example, if maintaining the service becomes impractical, we might have to shut it down. We will try to give advance notice for major changes or a shutdown, so you can download your data.</p>
          <p className="mb-4">Likewise, we may update these Terms occasionally to reflect changes in our service or for legal reasons. If we make significant changes, we will notify users (for instance, via email or a prominent notice on the site). Continued use of Soil-Sync after changes to the Terms means you accept the new terms. If you don’t agree with changes, you should stop using the service and, if applicable, delete your account.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">General Legal Stuff</h2>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Governing Law:</strong> These Terms are governed by and construed in accordance with the laws of <strong>[Insert jurisdiction, e.g., your country or state]</strong>. This just means that if there’s a legal dispute, we’ll use the specified region’s laws to resolve it. If you are located outside of our jurisdiction, local mandatory laws may still apply for consumer protection.</li>
            <li><strong>Dispute Resolution:</strong> We genuinely prefer to resolve any issues amicably and informally. If you have any concern or dispute with Soil-Sync, please contact us first and we’ll try to work it out in good faith. In the unlikely event we can’t resolve it, and if it goes to legal proceedings, it will be handled in the courts of the governing law region mentioned above (unless another law requires otherwise).</li>
            <li><strong>Severability:</strong> If any part of these Terms is found to be unenforceable or invalid, that part can be removed or limited, and the rest of the Terms will still be in effect.</li>
            <li><strong>No Waiver:</strong> If we don’t immediately act on a violation of these Terms, it doesn’t mean we’re waiving our right. For example, if you do something that violates the Terms and we don’t address it right away, we can still address it later.</li>
            <li><strong>Entire Agreement:</strong> These Terms (along with our Privacy Policy and other policies linked in our footer) make up the entire agreement between you and Soil-Sync regarding the use of our service. They supersede any prior agreements (for example, any oral promises or discussions that aren’t reflected here aren’t binding).</li>
            <li><strong>Assignment:</strong> You can’t transfer your rights or obligations under these Terms to someone else without our consent. Soil-Sync can transfer its rights and obligations (for example, if our project is ever acquired or merged with another).</li>
            <li><strong>Headings:</strong> The headings in this document (like “Using Soil-Sync” etc.) are there to make it easier to read; they don’t have legal effect by themselves.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Closing and Contact</h2>
          <p className="mb-4">Thank you for using Soil-Sync! We hope these Terms help clarify the relationship and set proper expectations. Our goal is to help you gain insights into your soil in a safe and useful way.</p>
          <p className="mb-4">If you have any questions or concerns about these Terms, or Soil-Sync in general, please contact us at <strong>[contact email or form link]</strong>. We appreciate feedback and are here to help.</p>
          <p className="mb-4">By continuing to use Soil-Sync, you confirm that you understand and agree to these Terms of Service. Happy soil analyzing!</p>
        </section>
        <div className="text-center mt-10">
        
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 