# Media Storage Setup Guide

This guide explains how media files (images and videos) are handled in the incident reporting application, ensuring persistent storage across sessions and logins.

## Overview

The application uses a two-part media storage system:
1. **Physical Files**: Media files are stored in the `/backend/uploads` directory
2. **Database URLs**: Only the URL/path to media files is stored in the database (not the actual file data)

This approach ensures:
- ✅ Media files persist across logins and sessions
- ✅ Efficient database storage (only URLs, not binary data)
- ✅ Fast media retrieval
- ✅ Easy file management and backups

## Architecture

### Backend Components

#### 1. Upload Middleware (`/backend/middleware/upload.middleware.js`)
- Handles file uploads using Multer
- Validates file types (images and videos only)
- Generates unique filenames to prevent collisions
- Stores files in `/backend/uploads` directory
- File size limit: 50MB per file

#### 2. Upload Routes (`/backend/routes/upload.routes.js`)
- `POST /api/upload` - Upload multiple files (max 10 at once)
- `DELETE /api/upload/:filename` - Delete a specific file

#### 3. Static File Serving
The Express server serves uploaded files at `/uploads/*`:
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

#### 4. Database Model
The Incident model stores media as a JSONB array:
```javascript
media: {
  type: DataTypes.JSONB,
  defaultValue: [],
  allowNull: false
}
```

Each media item has this structure:
```javascript
{
  id: "unique-id",
  type: "image" | "video",
  url: "/uploads/filename-timestamp.jpg",
  filename: "filename-timestamp.jpg",
  originalName: "original-file.jpg",
  size: 1024000,
  mimetype: "image/jpeg"
}
```

### Frontend Components

#### 1. Upload Service (`/utils/uploadService.ts`)
- `uploadMediaFiles(files)` - Uploads files to the server
- `deleteMediaFile(filename)` - Deletes a file from the server
- `fileToDataURL(file)` - Converts File to data URL for preview

#### 2. API Configuration (`/config/api.ts`)
- Defines API base URL and endpoints
- `getMediaUrl(path)` - Constructs full URL for media files
- Handles authentication headers

#### 3. CreateIncident Component
- Shows preview of selected files before upload
- Uploads files to server on form submission
- Stores server URLs in the database (not base64 data)

## How It Works

### Creating an Incident with Media

1. **User selects files**:
   - Files are read as data URLs for immediate preview
   - Actual File objects are stored temporarily in state

2. **User submits form**:
   - Files are uploaded to `/api/upload` endpoint
   - Server saves files to `/backend/uploads/`
   - Server returns URLs like `/uploads/image-1234567890.jpg`
   - These URLs are saved to the database with the incident

3. **Viewing incidents**:
   - Frontend fetches incident from database
   - Media URLs are converted to full URLs: `http://localhost:5000/uploads/image-1234567890.jpg`
   - Images/videos are displayed using these URLs

### Data Flow

```
[User Selects File] 
    ↓
[Preview (Data URL)] 
    ↓
[User Submits] 
    ↓
[Upload to Server] → [Server Saves to /uploads/] → [Returns URL]
    ↓
[Save URL to Database]
    ↓
[Fetch from Database] → [Construct Full URL] → [Display Media]
```

## Setup Instructions

### 1. Backend Setup

The backend is already configured. Just ensure the uploads directory exists:

```bash
cd backend
mkdir -p uploads
```

The `.gitkeep` file ensures this directory is tracked by Git.

### 2. Environment Variables

Create `/backend/.env` with:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=incident_reporting
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@incidentreporting.com
```

### 3. Frontend Configuration

Create `/frontend/.env` (if using Vite):

```env
VITE_API_URL=http://localhost:5000
```

Or update `/config/api.ts` directly if needed.

### 4. Start the Application

Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

Terminal 2 - Frontend:
```bash
npm install
npm run dev
```

## Testing Media Upload

1. Navigate to "Create Incident" page
2. Fill in incident details
3. Click "Upload Images" or "Upload Videos"
4. Select one or more files
5. Preview appears immediately
6. Click "Submit Incident"
7. Files are uploaded to server (you'll see loading state)
8. Navigate to "View Incidents"
9. Click on your incident
10. Media should display from server URLs

## Verifying Storage

### Check Database
```sql
SELECT id, title, media FROM Incidents WHERE id = 'your-incident-id';
```

You should see:
```json
{
  "media": [
    {
      "id": "abc123",
      "type": "image",
      "url": "/uploads/photo-1234567890.jpg",
      "filename": "photo-1234567890.jpg"
    }
  ]
}
```

### Check File System
```bash
ls -la backend/uploads/
```

You should see your uploaded files with timestamps in the filename.

### Check Browser
Open browser DevTools → Network tab:
- Look for requests to `http://localhost:5000/uploads/*`
- Files should return 200 OK status
- Images should display properly

## Important Notes

### ⚠️ Production Considerations

1. **File Storage**: Consider using cloud storage (AWS S3, Cloudinary, etc.) for production
2. **Security**: Add authentication checks to file access
3. **Backups**: Regularly backup the uploads directory
4. **Size Limits**: Adjust based on your server capacity
5. **CORS**: Ensure CORS is properly configured for your domain

### 🔒 Security

The upload middleware includes:
- File type validation (only images/videos)
- File size limits (50MB per file)
- Authentication required (JWT token)
- Unique filename generation to prevent overwrites

### 📁 File Organization

Files are stored with this naming pattern:
```
originalname-timestamp-random.ext
```

Example:
```
photo-1700000000000-123456789.jpg
video-1700000000001-987654321.mp4
```

## Troubleshooting

### Files Not Uploading
- Check backend console for errors
- Verify uploads directory exists and is writable
- Check file size doesn't exceed 50MB
- Ensure JWT token is valid

### Files Not Displaying
- Check browser console for CORS errors
- Verify API_BASE_URL is correct
- Check that backend server is running
- Verify file exists in uploads directory

### Files Lost After Restart
- Uploads directory should persist across restarts
- If using Docker, ensure volume is mounted
- Check that files are actually being saved to disk

## API Reference

### Upload Files
```http
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
  media: [File, File, ...] (max 10 files)

Response:
{
  "status": "success",
  "message": "Files uploaded successfully",
  "data": {
    "files": [
      {
        "id": "filename",
        "type": "image",
        "url": "/uploads/filename.jpg",
        "filename": "filename.jpg",
        "originalName": "original.jpg",
        "size": 1024000,
        "mimetype": "image/jpeg"
      }
    ]
  }
}
```

### Delete File
```http
DELETE /api/upload/:filename
Authorization: Bearer <token>

Response:
{
  "status": "success",
  "message": "File deleted successfully"
}
```

### Get File
```http
GET /uploads/:filename

Response: File content (image/video)
```

## Migration from Base64

If you have existing incidents with base64-encoded media:

1. Create a migration script to:
   - Extract base64 data
   - Decode and save as files
   - Update database with file URLs

2. Example migration:
```javascript
const fs = require('fs');
const path = require('path');

incidents.forEach(incident => {
  incident.media.forEach(media => {
    if (media.url.startsWith('data:')) {
      // Extract base64
      const base64Data = media.url.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Generate filename
      const filename = `migrated-${Date.now()}-${Math.random()}.${ext}`;
      const filepath = path.join(__dirname, 'uploads', filename);
      
      // Save file
      fs.writeFileSync(filepath, buffer);
      
      // Update URL
      media.url = `/uploads/${filename}`;
    }
  });
  
  // Save updated incident
  incident.save();
});
```

## Summary

✅ Media files are stored in `/backend/uploads/`
✅ Only URLs are stored in the database
✅ Files persist across logins and sessions
✅ Efficient and scalable approach
✅ Easy to backup and manage
✅ Frontend displays media from server URLs

Your media storage system is now properly configured and ready for production use!
