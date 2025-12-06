import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Shield } from 'lucide-react';

export const Policy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-red-600" />
        <div>
          <h1 className="text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-1">Last updated: November 21, 2024</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            At iReporter, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
          <p>
            Please read this privacy policy carefully. By using iReporter, you agree to the collection and use of information in accordance with this policy.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p className="font-semibold text-gray-900">Personal Information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information (email, phone number)</li>
            <li>Account credentials (username, encrypted password)</li>
            <li>Profile picture (optional)</li>
            <li>Location data when reporting incidents</li>
          </ul>
          
          <Separator className="my-4" />
          
          <p className="font-semibold text-gray-900">Incident Report Data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Incident descriptions and titles</li>
            <li>Geographic coordinates (latitude/longitude)</li>
            <li>Photos and videos uploaded as evidence</li>
            <li>Timestamps of reports and updates</li>
            <li>Incident status and administrative comments</li>
          </ul>
          
          <Separator className="my-4" />
          
          <p className="font-semibold text-gray-900">Usage Data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pages visited and features used</li>
            <li>Time spent on the platform</li>
            <li>Browser type and device information</li>
            <li>IP address and general location</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain the iReporter service</li>
            <li>To process and track incident reports</li>
            <li>To notify you about changes to your incident status</li>
            <li>To communicate with you about your account and reports</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To improve our services and user experience</li>
            <li>To analyze usage patterns and platform performance</li>
            <li>To comply with legal obligations and assist law enforcement when required</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Sharing and Disclosure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p className="font-semibold text-gray-900">We may share your information with:</p>
          
          <div className="space-y-4 mt-4">
            <div>
              <p className="font-semibold text-gray-900">Government Agencies:</p>
              <p>Incident reports may be shared with relevant government agencies and authorities for investigation and resolution purposes.</p>
            </div>
            
            <div>
              <p className="font-semibold text-gray-900">Law Enforcement:</p>
              <p>We may disclose information when required by law or to protect the rights, property, or safety of iReporter, our users, or the public.</p>
            </div>
            
            <div>
              <p className="font-semibold text-gray-900">Service Providers:</p>
              <p>We may share data with third-party service providers who assist in operating our platform, conducting our business, or serving our users.</p>
            </div>
          </div>
          
          <p className="mt-4">
            <strong>We will never:</strong> Sell your personal information to third parties for marketing purposes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of sensitive data in transit and at rest</li>
            <li>Secure authentication and password hashing</li>
            <li>Regular security audits and monitoring</li>
            <li>Access controls and authorization mechanisms</li>
            <li>Secure backup and recovery procedures</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Privacy Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> Request copies of your personal data</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Erasure:</strong> Request deletion of your personal data (subject to legal obligations)</li>
            <li><strong>Restrict Processing:</strong> Request limitation of how we use your data</li>
            <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Object:</strong> Object to our processing of your personal data</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at privacy@ireporter.com
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Active accounts: Data retained while account is active</li>
            <li>Incident reports: Retained for 7 years for legal and administrative purposes</li>
            <li>Deleted accounts: Personal data removed within 30 days (except as required by law)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cookies and Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with small amounts of data that may include an anonymous unique identifier.
          </p>
          <p className="mt-4">
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read the privacy policies of any third-party services you visit.
          </p>
          <p className="mt-4">
            Third-party services we use include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Google Maps API (for location services)</li>
            <li>Analytics services (for usage statistics)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            iReporter is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Changes to This Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
          <p className="mt-4">
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <div className="mt-4 space-y-2">
            <p><strong>Email:</strong> legal@ireporter.com</p>
            <p><strong>Phone:</strong> (+256) 740397395</p>
            <p><strong>Address:</strong> 123 Buganda Road  Kampala, CC 12345</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
