import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MapPicker } from '../components/MapPicker';
import { MediaGallery } from '../components/MediaGallery';
import { IncidentType, Location, MediaFile } from '../types';
import { Upload, AlertCircle, Image as ImageIcon, Video, X, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';
import { uploadMediaFiles, fileToDataURL } from '../utils/uploadService';
import { getMediaUrl } from '../config/api';

export const CreateIncident: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createIncident, updateIncident, getIncidentById } = useData();
  const { user } = useAuth();
  
  const [type, setType] = useState<IncidentType>('red-flag');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<Location>({
    lat: 40.7128,
    lng: -74.0060,
  });
  const [images, setImages] = useState<MediaFile[]>([]);
  const [videos, setVideos] = useState<MediaFile[]>([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<{ images: File[], videos: File[] }>({ images: [], videos: [] });

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const imageFiles: File[] = [];
    const videoFiles: File[] = [];
    
    // Separate images and videos
    filesArray.forEach((file) => {
      if (file.type.startsWith('video/')) {
        videoFiles.push(file);
      } else if (file.type.startsWith('image/')) {
        imageFiles.push(file);
      }
    });

    // Create preview URLs for immediate display
    const previewPromises = filesArray.map(async (file) => {
      const previewUrl = await fileToDataURL(file);
      return {
        id: crypto.randomUUID(),
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
        url: previewUrl,
      };
    });

    const previews = await Promise.all(previewPromises);
    
    // Add previews to state
    previews.forEach((preview) => {
      if (preview.type === 'video') {
        setVideos(prev => [...prev, preview]);
      } else {
        setImages(prev => [...prev, preview]);
      }
    });

    // Store actual files for later upload
    setPendingFiles(prev => ({
      images: [...prev.images, ...imageFiles],
      videos: [...prev.videos, ...videoFiles]
    }));
  };

  const handleRemoveMedia = (id: string) => {
    setImages(images.filter((m) => m.id !== id));
    setVideos(videos.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'under-investigation') => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    try {
      setUploading(true);
      
      // Upload pending files to server
      let uploadedMedia: MediaFile[] = [];
      const allPendingFiles = [...pendingFiles.images, ...pendingFiles.videos];
      
      if (allPendingFiles.length > 0) {
        uploadedMedia = await uploadMediaFiles(allPendingFiles);
      }
      
      // Combine uploaded media with existing media (for edit mode)
      const existingMedia = [...images, ...videos].filter(m => !m.url.startsWith('data:'));
      const allMedia = [...existingMedia, ...uploadedMedia];

      if (id) {
        await updateIncident(id, {
          type,
          title,
          description,
          location,
          media: allMedia,
          status,
        });
        toast.success(status === 'draft' ? 'Draft updated successfully' : 'Incident updated and submitted');
      } else {
        await createIncident({
          type,
          title,
          description,
          location,
          media: allMedia,
          status,
        });
        toast.success(status === 'draft' ? 'Draft saved successfully' : 'Incident submitted successfully');
      }

      navigate('/incidents');
    } catch (error) {
      console.error('Submit error:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit incident');
      toast.error('Failed to upload media files');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const incident = getIncidentById(id);
      if (incident) {
        // Only allow editing drafts
        if (incident.status !== 'draft') {
          navigate('/incidents');
          return;
        }
        // Only allow editing own incidents
        if (incident.userId !== user?.id) {
          navigate('/incidents');
          return;
        }
        setType(incident.type);
        setTitle(incident.title);
        setDescription(incident.description);
        setLocation(incident.location);
        setImages(incident.media.filter(m => m.type === 'image'));
        setVideos(incident.media.filter(m => m.type === 'video'));
      }
    }
  }, [id, getIncidentById, navigate, user]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <Alert>
          <AlertDescription>Please sign in to create incidents</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">{id ? 'Edit Draft Incident' : 'Create New Incident'}</h1>
        <p className="text-gray-600">
          Report a red-flag (corruption) or request an intervention (infrastructure issue)
        </p>
      </div>

      <form className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Describe the incident you want to report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Incident Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as IncidentType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red-flag">Red-flag (Corruption)</SelectItem>
                  <SelectItem value="intervention">Intervention (Infrastructure)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                {type === 'red-flag' 
                  ? 'Report corruption, bribery, or misuse of public funds'
                  : 'Request repairs or improvements to public infrastructure'
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the incident"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required className="text-[rgba(10,10,10,0.79)]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the incident..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Specify where the incident occurred</CardDescription>
          </CardHeader>
          <CardContent>
            <MapPicker location={location} onChange={setLocation} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media Attachments</CardTitle>
            <CardDescription>Upload photos or videos as evidence (optional)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Media Upload Placeholders in One Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Images Upload */}
              <div className="flex-1">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <Label htmlFor="image-upload" className="cursor-pointer block">
                  <div className="relative border-2 border-dashed border-teal-400/40 bg-white/30 backdrop-blur-md rounded-lg hover:border-teal-500 hover:bg-teal-50/40 hover:backdrop-blur-lg transition-all group min-h-[240px] overflow-hidden shadow-lg">
                    {images.length === 0 ? (
                      <div className="p-10 text-center flex flex-col items-center justify-center h-full">
                        <div className="bg-teal-500/10 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors shadow-md">
                          <ImageIcon className="w-8 h-8 text-teal-600" />
                        </div>
                        <p className="text-gray-900 mb-1">Upload Images</p>
                        <p className="text-sm text-gray-600">PNG, JPG, GIF</p>
                        <p className="text-xs text-gray-500 mt-1">Max size: 10MB each</p>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {images.map((img) => (
                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group/item">
                              <img 
                                src={img.url} 
                                alt="Uploaded" 
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveMedia(img.id);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="text-center py-2 text-sm text-teal-600 border-t border-teal-200/50 backdrop-blur-sm">
                          + Add more images
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <div className="bg-teal-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full shadow-lg bg-[rgba(237,26,26,0.88)]">
                        Photos {images.length > 0 && `(${images.length})`}
                      </div>
                    </div>
                  </div>
                </Label>
              </div>

              {/* Videos Upload */}
              <div className="flex-1">
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleMediaUpload}
                  className="hidden"
                />
                <Label htmlFor="video-upload" className="cursor-pointer block">
                  <div className="relative border-2 border-dashed border-blue-400/40 bg-white/30 backdrop-blur-md rounded-lg hover:border-blue-500 hover:bg-blue-50/40 hover:backdrop-blur-lg transition-all group min-h-[240px] overflow-hidden shadow-lg">
                    {videos.length === 0 ? (
                      <div className="p-10 text-center flex flex-col items-center justify-center h-full">
                        <div className="bg-blue-500/10 backdrop-blur-sm rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors shadow-md">
                          <Video className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-gray-900 mb-1">Upload Videos</p>
                        <p className="text-sm text-gray-600">MP4, MOV, AVI</p>
                        <p className="text-xs text-gray-500 mt-1">Max size: 10MB each</p>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {videos.map((vid) => (
                            <div key={vid.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group/item">
                              <video 
                                src={vid.url} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0)] bg-opacity-30">
                                <div className="w-10 h-10 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                                  <Video className="w-5 h-5 text-blue-600" />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveMedia(vid.id);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-red-600 z-10"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="text-center py-2 text-sm text-blue-600 border-t border-blue-200/50 backdrop-blur-sm">
                          + Add more videos
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <div className="bg-blue-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full shadow-lg bg-[rgba(237,26,26,0.8)]">
                        Videos {videos.length > 0 && `(${videos.length})`}
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={uploading}
          >
            {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'under-investigation')}
            disabled={uploading}
          >
            {uploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {uploading ? 'Uploading...' : 'Submit Incident'}
          </Button>
        </div>
      </form>
    </div>
  );
};