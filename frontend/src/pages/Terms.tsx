import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { FileText } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-8 h-8 text-red-600" />
        <div>
          <h1 className="text-gray-900">Terms and Conditions</h1>
          <p className="text-gray-600 mt-1">Last updated: November 21, 2024</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            By accessing and using the iReporter platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
          <p>
            iReporter is a platform designed to enable citizens to report corruption incidents (red-flags) and request government intervention for infrastructure issues (interventions).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. User Responsibilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p className="font-semibold text-gray-900">As a user of iReporter, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and truthful information in all incident reports</li>
            <li>Only report genuine incidents of corruption or infrastructure issues</li>
            <li>Upload media (photos/videos) that are relevant and related to the incident being reported</li>
            <li>Not use the platform for malicious purposes or to defame individuals without evidence</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Incident Reporting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p className="font-semibold text-gray-900">Red-Flag Reports:</p>
          <p>
            Reports categorized as "red-flags" should involve corruption, bribery, embezzlement, or misuse of public funds. False reporting of corruption may have legal consequences.
          </p>
          
          <Separator className="my-4" />
          
          <p className="font-semibold text-gray-900">Intervention Requests:</p>
          <p>
            Reports categorized as "interventions" should involve requests for government action on infrastructure issues such as damaged roads, broken water pipes, faulty street lights, etc.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Content Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>Users must not post content that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Is false, misleading, or fraudulent</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains hate speech, discrimination, or harassment</li>
            <li>Is obscene, pornographic, or sexually explicit</li>
            <li>Promotes violence or illegal activities</li>
            <li>Contains personal information of others without consent</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Account Suspension and Termination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms. This includes but is not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Repeated false reporting</li>
            <li>Abusive or harassing behavior</li>
            <li>Attempts to manipulate or abuse the platform</li>
            <li>Violation of content guidelines</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Data Collection and Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            By using iReporter, you consent to the collection and use of your information as described in our Privacy Policy. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal information provided during registration</li>
            <li>Incident reports including descriptions, locations, and media</li>
            <li>Usage data and analytics</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Media and Evidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            When uploading photos or videos as evidence:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ensure you have the right to share the media</li>
            <li>Media should be directly related to the incident</li>
            <li>Do not upload copyrighted material without permission</li>
            <li>Respect privacy rights of individuals captured in media</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            iReporter is a reporting platform and does not guarantee that reported incidents will be resolved. We are not responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Actions taken by government agencies based on reports</li>
            <li>Delays in incident investigation or resolution</li>
            <li>Content posted by other users</li>
            <li>Any damages arising from use of the platform</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Modifications to Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the platform after changes constitutes acceptance of the modified terms.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10. Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-700">
          <p>
            For questions about these Terms and Conditions, please contact us at:
          </p>
          <p className="font-semibold text-gray-900">
            Email: legal@ireporter.com<br />
            Phone: (+256) 740397395
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
