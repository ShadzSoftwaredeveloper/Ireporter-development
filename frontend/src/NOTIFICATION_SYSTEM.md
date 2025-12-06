# Email & Notification System Documentation

## Overview
The iReporter application has a **fully functional notification and email simulation system** that automatically triggers when:
1. **Any user creates an incident** → All admins receive notifications and email alerts
2. **Admin updates incident status** → The incident owner receives notification and email alert

---

## System Architecture

### Components Involved

1. **DataContext** (`/contexts/DataContext.tsx`)
   - Manages incident data and CRUD operations
   - Triggers callbacks when incidents are created or updated
   - Lines 82-85: Triggers `onIncidentCreate` when user creates incident
   - Lines 103-108: Triggers `onStatusUpdate` when admin updates status

2. **NotificationContext** (`/contexts/NotificationContext.tsx`)
   - Manages notification state
   - Stores notifications in localStorage
   - Provides `addNotification()` function
   - Tracks unread count

3. **App.tsx** (Lines 28-78)
   - Connects DataProvider and NotificationProvider
   - Implements notification logic
   - Shows toast messages for email simulation

---

## How It Works

### 1. User Creates Incident

**Flow:**
```
User submits incident
    ↓
DataContext.createIncident() [Line 68]
    ↓
onIncidentCreate callback triggered [Line 83-85]
    ↓
App.handleIncidentCreate() [Line 51-78]
    ↓
- Fetches all admin users from localStorage
- Creates notification for each admin
- Shows toast: "📧 Email notifications sent to X admin(s)"
```

**Code in App.tsx:**
```typescript
const handleIncidentCreate = (incident: Incident) => {
  // Get all admin users
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    const users = JSON.parse(storedUsers);
    const admins = users.filter((user: any) => user.role === 'admin');
    
    // Create notification for each admin
    admins.forEach((admin: any) => {
      const incidentType = incident.type === 'red-flag' ? 'Red-flag' : 'Intervention';
      const message = `New ${incidentType.toLowerCase()} incident reported: "${incident.title}"`;
      
      addNotification({
        userId: admin.id,
        incidentId: incident.id,
        incidentTitle: incident.title,
        type: 'new-incident',
        message,
        newStatus: incident.status as any,
      });
    });

    // Show email simulation toast
    if (admins.length > 0) {
      toast.success(`📧 Email notifications sent to ${admins.length} admin${admins.length > 1 ? 's' : ''}`);
    }
  }
};
```

**What Admins See:**
- 🔔 Bell icon badge count increases
- Notification dropdown shows new incident alert
- Toast message: "📧 Email notifications sent to X admin(s)"
- Can click notification to view incident details

---

### 2. Admin Updates Incident Status

**Flow:**
```
Admin changes incident status
    ↓
DataContext.updateIncident() [Line 88]
    ↓
Detects admin role and status change [Line 103]
    ↓
onStatusUpdate callback triggered [Line 105-107]
    ↓
App.handleStatusUpdate() [Line 32-49]
    ↓
- Creates notification for incident owner
- Shows toast: "📧 Email notification sent to user"
```

**Code in App.tsx:**
```typescript
const handleStatusUpdate = (incident: Incident, oldStatus: string, newStatus: string) => {
  // Create notification for the incident owner
  const statusText = newStatus.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const message = `Your incident status has been updated to "${statusText}"`;
  
  addNotification({
    userId: incident.userId,
    incidentId: incident.id,
    incidentTitle: incident.title,
    type: 'status-update',
    message,
    oldStatus: oldStatus as any,
    newStatus: newStatus as any,
  });

  // Show email simulation toast
  toast.success(`📧 Email notification sent to user about status update`);
};
```

**What Users See:**
- 🔔 Bell icon badge count increases
- Notification dropdown shows status update
- Toast message: "📧 Email notification sent to user about status update"
- Can click notification to view updated incident

---

## Notification Types

### 1. **new-incident**
- **Recipient:** All admin users
- **Trigger:** User creates/submits an incident
- **Message Format:** `"New [type] incident reported: [title]"`
- **Example:** `"New red-flag incident reported: Corruption in Public Procurement"`

### 2. **status-update**
- **Recipient:** Incident owner (user who created it)
- **Trigger:** Admin changes incident status
- **Message Format:** `"Your incident status has been updated to [status]"`
- **Example:** `"Your incident status has been updated to Resolved"`

---

## Email Simulation

Since this is a frontend-only application, actual emails are **simulated** using toast notifications:

- **Green toast with 📧 icon** appears when notifications are sent
- **For incident creation:** `"📧 Email notifications sent to X admin(s)"`
- **For status updates:** `"📧 Email notification sent to user about status update"`

### In Production Environment:
To implement actual emails, you would:
1. Connect to email service (SendGrid, AWS SES, Mailgun)
2. Replace toast notifications with actual API calls
3. Send formatted HTML emails with incident details

---

## User Interface Elements

### 1. Bell Icon (Header)
- Shows notification count badge
- Red badge with number of unread notifications
- Clicking opens NotificationDropdown

### 2. Notification Dropdown
- Shows recent 5 notifications
- Click notification → navigates to incident detail
- "Mark as read" functionality
- "View all" link to full notifications page

### 3. Notifications Page (`/notifications`)
- Tabs: All / Unread / Read
- Full list of all notifications
- Mark all as read button
- Clear all read notifications option
- Incident details and navigation

---

## Testing the System

### Test Scenario 1: User Creates Incident
1. **Login as regular user**
2. Navigate to "Create Incident"
3. Fill out form and submit
4. **Expected Results:**
   - Toast: "Incident submitted successfully"
   - Toast: "📧 Email notifications sent to X admin(s)"
   - Login as admin to see notification

### Test Scenario 2: Admin Updates Status
1. **Login as admin**
2. Navigate to any incident
3. Change status (e.g., "Under Investigation" → "Resolved")
4. Add admin comment
5. Click "Update Status"
6. **Expected Results:**
   - Toast: "Incident status updated successfully"
   - Toast: "📧 Email notification sent to user about status update"
   - Login as incident owner to see notification

---

## Data Storage

### LocalStorage Keys:
- `notifications` - Array of all notifications
- `incidents` - Array of all incidents
- `users` - Array of all user accounts
- `currentUser` - Currently logged-in user

### Notification Object Structure:
```typescript
{
  id: string;
  userId: string;              // Recipient user ID
  incidentId: string;          // Related incident ID
  incidentTitle: string;       // Incident title for display
  type: 'status-update' | 'new-incident';
  message: string;             // Notification message
  oldStatus?: IncidentStatus;  // For status updates
  newStatus: IncidentStatus;   // New/current status
  createdAt: string;           // ISO timestamp
  read: boolean;               // Read status
}
```

---

## Configuration

### Auto-sending Rules (Already Configured):

✅ **Incident Creation** → Sends to ALL admins
✅ **Status Updates by Admin** → Sends to incident owner
✅ **Email Simulation** → Toast notifications
✅ **Bell Badge Updates** → Real-time unread count
✅ **Persistent Storage** → Notifications saved in localStorage

---

## Summary

The notification and email system is **100% functional** and automatically handles:

✅ Admin notifications when users create incidents  
✅ User notifications when admins update status  
✅ Email simulation via toast messages  
✅ Real-time bell badge updates  
✅ Notification dropdown and full page view  
✅ Mark as read/unread functionality  
✅ Persistent storage across sessions  

**No additional configuration needed** - the system works out of the box!
