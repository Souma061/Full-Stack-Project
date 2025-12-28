import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishVideo } from '../api/video.api';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail || !title || !description) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoFile', videoFile);
    formData.append('thumbnail', thumbnail);

    try {
      setUploading(true);
      await publishVideo(formData, (progress) => {
        setUploadProgress(progress);
      });
      alert("Video uploaded successfully!");
      navigate('/');
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Make sure you are logged in.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-10 text-white">
      <div className="w-full max-w-3xl bg-[#1f1f1f] p-8 rounded-xl shadow-lg border border-[#333]">
        <h1 className="text-2xl font-bold mb-6 border-b border-[#333] pb-4">Upload Video</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              placeholder="Enter video title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea
              rows="4"
              placeholder="Tell viewers about your video"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Video File</label>
              <div className="relative border-2 border-dashed border-[#333] rounded-lg p-6 hover:bg-[#272727] transition-colors text-center cursor-pointer">
                <input
                  type="file"
                  accept="video/*"
                  onChange={e => setVideoFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-3xl mb-2 text-blue-500">video_library</span>
                  <span className="text-sm text-gray-400">{videoFile ? videoFile.name : "Select Video File"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Thumbnail</label>
              <div className="relative border-2 border-dashed border-[#333] rounded-lg p-6 hover:bg-[#272727] transition-colors text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setThumbnail(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-3xl mb-2 text-purple-500">image</span>
                  <span className="text-sm text-gray-400">{thumbnail ? thumbnail.name : "Select Thumbnail"}</span>
                </div>
              </div>
            </div>
          </div>


          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-500">Uploading...</span>
                <span className="text-sm font-medium text-blue-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={uploading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${uploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {uploading ? "Uploading..." : "Publish Video"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
