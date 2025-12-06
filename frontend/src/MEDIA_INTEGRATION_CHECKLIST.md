# Media Storage Integration Checklist

## ✅ Completed Setup

### Backend Files Created/Updated
- ✅ `/backend/middleware/upload.middleware.js` - Multer configuration for file uploads
- ✅ `/backend/routes/upload.routes.js` - Upload/delete endpoints
- ✅ `/backend/server.js` - Added upload routes and static file serving
- ✅ `/backend/uploads/.gitkeep` - Placeholder for uploads directory
- ✅ `/backend/.gitignore` - Excludes uploaded files from Git

### Frontend Files Created/Updated
- ✅ `/config/api.ts` - API configuration and URL helpers
- ✅ `/utils/uploadService.ts` - Upload service functions
- ✅ `/pages/CreateIncident.tsx` - Updated to upload files to server
- ✅ `/components/MediaGallery.tsx` - Updated to use server URLs

### Documentation
- ✅ `/MEDIA_STORAGE_SETUP.md` - Comprehensive setup guide
- ✅ `/MEDIA_INTEGRATION_CHECKLIST.md` - This checklist

## 🚀 Quick Start

### 1. Verify Backend Dependencies
```bash
cd backend
npm install
# Check that multer is installed
npm list multer
```

If multer is not installed:
```bash
npm install multer
```

### 2. Create Uploads Directory
```bash
cd backend
mkdir -p uploads
# Verify it exists
ls -la uploads/
```

### 3. Configure Environment Variables
Edit `/backend/.env`:
```env
# Add these if not present
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 4. Start Backend Server
```bash
cd backend
npm run dev
```

Verify you see:
```
✅ Database connection established successfully
✅ Database models synchronized
🚀 Server is running on port 5000
```

### 5. Start Frontend
```bash
# From root directory
npm run dev
```

### 6. Test Media Upload

1. Navigate to http://localhost:5173
2. Sign in (use existing credentials)
3. Click "Create Incident"
4. Fill in required fields
5. Click "Upload Images" or "Upload Videos"
6. Select a test file
7. Verify preview appears
8. Click "Submit Incident"
9. Watch for "Uploading..." state
10. Navigate to "View Incidents"
11. Open your incident
12. Verify media displays correctly

## 🔍 Verification Steps

### Test 1: Upload Endpoint
```bash
# Test that upload endpoint is registered
curl http://localhost:5000/api/upload
# Should return: Authorization header required
```

### Test 2: Static Files
```bash
# After uploading a file, test direct access
curl http://localhost:5000/uploads/your-file-name.jpg
# Should return the image file
```

### Test 3: Database Check
```sql
-- Check that media URLs are stored correctly
SELECT id, title, JSON_EXTRACT(media, '$[0].url') as first_media_url 
FROM Incidents 
WHERE JSON_LENGTH(media) > 0
LIMIT 5;
```

Expected result:
```
| id    | title      | first_media_url           |
|-------|------------|---------------------------|
| abc   | Incident 1 | "/uploads/photo-123.jpg"  |
```

### Test 4: File System Check
```bash
cd backend/uploads
ls -lh
# Should show uploaded files with timestamps
```

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot POST /api/upload"
**Solution**: 
- Verify server is running
- Check that uploadRoutes is imported in server.js
- Restart the backend server

### Issue 2: Files not persisting
**Solution**:
- Check uploads directory exists
- Verify directory permissions (should be writable)
- Check .gitignore doesn't exclude uploads directory itself

### Issue 3: CORS errors
**Solution**:
- Verify FRONTEND_URL in .env matches your frontend URL
- Check CORS configuration in server.js
- Ensure credentials: true is set

### Issue 4: Images not displaying
**Solution**:
- Open browser DevTools → Network tab
- Check for 404 errors on /uploads/* requests
- Verify API_BASE_URL in /config/api.ts
- Check that getMediaUrl() is being used

### Issue 5: "File too large" error
**Solution**:
- Default limit is 50MB
- Adjust in `/backend/middleware/upload.middleware.js`:
```javascript
limits: {
  fileSize: 100 * 1024 * 1024 // 100MB
}
```

## 📋 Integration with Database

### When Creating Incident
```javascript
// Frontend sends File objects
const files = [File, File, ...];

// Upload to server
const uploadedMedia = await uploadMediaFiles(files);
// Returns: [{ id, type, url: "/uploads/...", ... }]

// Save to database via API
await createIncident({
  ...incidentData,
  media: uploadedMedia  // Array of media objects with URLs
});
```

### When Displaying Media
```javascript
// Fetch incident from database
const incident = await getIncident(id);

// Media array contains URLs
incident.media = [
  { id: "1", type: "image", url: "/uploads/photo-123.jpg" }
];

// Convert to full URLs for display
const fullUrl = getMediaUrl(incident.media[0].url);
// Returns: "http://localhost:5000/uploads/photo-123.jpg"

// Use in img tag
<img src={fullUrl} alt="Incident" />
```

## 🔄 Migration from Base64

If you have existing incidents with base64 data, you need to migrate them:

### Step 1: Create Migration Script
Create `/backend/scripts/migrate-media.js`:
```javascript
const fs = require('fs');
const path = require('path');
const { Incident } = require('../models');

async function migrateMedia() {
  const incidents = await Incident.findAll();
  
  for (const incident of incidents) {
    const updatedMedia = [];
    
    for (const media of incident.media) {
      if (media.url.startsWith('data:')) {
        // Extract base64 data
        const matches = media.url.match(/^data:(.+?);base64,(.+)$/);
        if (!matches) continue;
        
        const mimetype = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Determine extension
        const ext = mimetype.split('/')[1];
        const filename = `migrated-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filepath = path.join(__dirname, '../uploads', filename);
        
        // Save file
        fs.writeFileSync(filepath, buffer);
        
        // Update media object
        updatedMedia.push({
          ...media,
          url: `/uploads/${filename}`,
          filename,
          size: buffer.length,
          mimetype
        });
      } else {
        // Keep existing media
        updatedMedia.push(media);
      }
    }
    
    // Update incident
    await incident.update({ media: updatedMedia });
    console.log(`Migrated ${incident.id}: ${updatedMedia.length} media files`);
  }
  
  console.log('Migration complete!');
}

migrateMedia().catch(console.error);
```

### Step 2: Run Migration
```bash
cd backend
node scripts/migrate-media.js
```

## 🎯 Next Steps

### Recommended Enhancements

1. **Add Image Compression**
   - Install sharp: `npm install sharp`
   - Compress images before saving
   - Generate thumbnails

2. **Add Cloud Storage**
   - Install AWS SDK or Cloudinary
   - Upload to S3/Cloudinary instead of local storage
   - Update URLs to cloud URLs

3. **Add Progress Indicators**
   - Show upload progress percentage
   - Use axios for better upload tracking

4. **Add File Validation**
   - Check file dimensions
   - Scan for malware
   - Validate file integrity

5. **Add Cleanup Job**
   - Remove orphaned files
   - Clean up failed uploads
   - Archive old files

## 📊 Monitoring

### Check Disk Usage
```bash
du -sh backend/uploads/
```

### Count Files
```bash
find backend/uploads -type f | wc -l
```

### Recent Uploads
```bash
ls -lt backend/uploads/ | head -10
```

## ✅ Final Checklist

Before deploying to production:

- [ ] Uploads directory exists and is writable
- [ ] .gitignore excludes uploaded files
- [ ] Environment variables are configured
- [ ] File size limits are appropriate
- [ ] CORS is configured for production domain
- [ ] Backup strategy for uploads directory
- [ ] Consider cloud storage for scalability
- [ ] Monitor disk space usage
- [ ] Test file upload/download
- [ ] Test with large files
- [ ] Test with multiple file types
- [ ] Verify database stores URLs correctly
- [ ] Verify files persist after server restart

## 🎉 Success Criteria

Your media storage is working correctly when:

✅ Users can upload images and videos
✅ Preview shows immediately after selection
✅ Files are saved to `/backend/uploads/`
✅ Database contains file URLs (not base64)
✅ Media displays on incident detail pages
✅ Files persist across server restarts
✅ Files persist across user logins
✅ No CORS errors in browser console
✅ Upload shows loading state
✅ Error handling works properly

---

## 📞 Support

If you encounter issues:

1. Check the console logs (both frontend and backend)
2. Review the MEDIA_STORAGE_SETUP.md guide
3. Verify all files were created correctly
4. Test each component individually
5. Check the troubleshooting section above

Your media storage system is now fully configured and ready to use! 🚀
