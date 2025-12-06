# Email Notification System Guide

## Overview
The incident reporting application now includes a comprehensive email notification system that simulates real email delivery. While this is a frontend-only implementation, it demonstrates the full workflow and provides detailed email templates.

## Features

### 1. **Admin Notifications (New Incidents)**
When a user creates an incident:
- ✅ All admin users receive **in-app notifications**
- 📧 Simulated **email notifications** are sent to each admin
- 🎯 Admins can click notifications to view incident details
- 📊 Toast notifications confirm email delivery

### 2. **User Notifications (Status Updates)**
When an admin updates an incident status:
- ✅ The incident owner receives an **in-app notification**
- 📧 Simulated **email notification** is sent to the user
- 💬 Admin comments are included in both notification and email
- 🎯 Users can click notifications to view updated incident details

## How It Works

### User Flow
1. **User creates incident** → Navigates to "Create Incident" page
2. Fills out incident details (type, title, description, location, media)
3. Submits the incident
4. **Notification triggered**: All admins receive notifications + emails

### Admin Flow
1. **Admin receives notification** → Sees notification in:
   - Notification bell icon (with unread count)
   - Admin Dashboard "Recent Notifications" widget
   - Notifications page
2. **Admin clicks on notification** → Navigates to incident detail page
3. **Admin updates status** → Two ways:
   - Click "Update Status" button on incident detail page
   - Click "Update" button in Admin Dashboard incidents list
4. Selects new status and adds admin comment
5. Submits update
6. **Notification triggered**: Incident owner receives notification + email

## Email Templates

### Admin Email (New Incident)
```
Subject: 🚨 New Red-flag Incident Reported

Dear Admin Name,

A new red-flag incident has been reported by User Name.

Incident Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title: Incident Title
Type: Red-flag
Location: Address or coordinates
Reported on: Date and time

Description:
Full incident description...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please review this incident and take appropriate action.
```

### User Email (Status Update)
```
Subject: ✅ Incident Status Updated: Incident Title

Dear User Name,

Your incident report has been updated by an administrator.

Incident: Incident Title
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Previous Status: Under Investigation
New Status: Resolved

Admin Comment:
[Admin's explanation of the status change]

Last Updated: Date and time
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Technical Implementation

### Email Service (`/utils/emailService.ts`)
- Centralized email template generation
- Console logging for development/testing
- Email history tracking
- Formatted email templates with proper structure

### Notification Context (`/contexts/NotificationContext.tsx`)
- Manages in-app notifications
- Persists to localStorage
- Toast notifications for real-time feedback

### Data Context (`/contexts/DataContext.tsx`)
- Triggers callbacks for incident creation and status updates
- Integrates with notification system

### App Integration (`/App.tsx`)
- Connects DataProvider with NotificationProvider
- Handles email sending via emailService
- Shows toast confirmations

## Viewing Simulated Emails

### Browser Console
Open your browser's Developer Console (F12) to see detailed email logs:

```
============================================================
📧 EMAIL SENT
============================================================
To: admin@example.com
Subject: 🚨 New Red-flag Incident Reported
Timestamp: Nov 25, 2025, 10:30 AM
------------------------------------------------------------
[Full email body with formatting]
============================================================
```

### Toast Notifications
Visual confirmation appears in the UI:
- "📧 Email notifications sent to 2 admins"
- "📧 Email notification sent to user about status update"

## Testing the Feature

### Test Scenario 1: New Incident
1. Sign in as a **user** account
2. Navigate to "Create Incident"
3. Fill out and submit an incident
4. Check console for admin email logs
5. Sign in as an **admin** account
6. See the new notification in Admin Dashboard
7. Click the notification to view the incident

### Test Scenario 2: Status Update
1. Sign in as an **admin** account
2. Go to Admin Dashboard → Incidents tab
3. Click "Update" on any incident
4. Change status and add admin comment
5. Submit the update
6. Check console for user email log
7. Sign in as the **user** who created the incident
8. See the status update notification
9. Click the notification to view updated incident

## Notification Pages

### User Dashboard
- Shows recent notifications with status updates
- Displays unread notification count
- Click notifications to view incidents

### Admin Dashboard
- "Recent Notifications" widget shows new incidents
- Displays up to 5 most recent notifications
- Links to full notification page

### Notifications Page
- Complete list of all user notifications
- Mark individual notifications as read
- Mark all as read
- Delete notifications
- Filter and sort capabilities

## Production Considerations

For a production environment, you would need to:

1. **Backend Integration**: Set up a real backend service
   - Node.js/Express, Python/Django, or similar
   - Email service provider (SendGrid, AWS SES, Mailgun, etc.)

2. **Database**: Store notifications persistently
   - PostgreSQL, MongoDB, or similar
   - Notification read/unread status
   - Email delivery status

3. **Real-time Updates**: Implement WebSocket or SSE
   - Socket.io, Pusher, or similar
   - Real-time notification delivery without page refresh

4. **Email Queue**: Implement background job processing
   - Bull Queue, RabbitMQ, or similar
   - Handle email delivery retries
   - Track email delivery status

5. **Security**: Add proper authentication and authorization
   - JWT tokens or session-based auth
   - Role-based access control
   - API rate limiting

## Benefits of This Implementation

✅ **Complete User Experience**: Full notification and email workflow
✅ **Easy Testing**: Console logs show exact email content
✅ **Production-Ready Templates**: Email templates ready for backend integration
✅ **Visual Feedback**: Toast notifications confirm actions
✅ **Persistent Notifications**: localStorage maintains state across sessions
✅ **Role-Based Access**: Proper separation between admin and user notifications

## Support

For questions or issues:
- Check browser console for email simulation logs
- Verify localStorage for stored notifications
- Ensure proper user roles (admin vs user)
- Test with different browsers if needed
