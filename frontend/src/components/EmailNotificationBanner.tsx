import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Mail, X, Check } from 'lucide-react';
import { Button } from './ui/button';

interface EmailNotificationBannerProps {
  show: boolean;
  recipientCount: number;
  recipientType: 'admin' | 'user';
  onClose: () => void;
}

export const EmailNotificationBanner: React.FC<EmailNotificationBannerProps> = ({
  show,
  recipientCount,
  recipientType,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !visible) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg p-4 min-w-[320px]">
        <div className="flex items-start gap-3">
          <div className="bg-green-500 rounded-full p-2 flex-shrink-0">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Check className="w-4 h-4 text-green-600" />
              <p className="text-green-900">Email Sent Successfully</p>
            </div>
            <p className="text-sm text-green-700">
              {recipientCount} {recipientType}{recipientCount > 1 ? 's' : ''} will receive an email notification
            </p>
            <p className="text-xs text-green-600 mt-1">
              Check browser console for email preview
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-green-100"
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
          >
            <X className="w-4 h-4 text-green-700" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
