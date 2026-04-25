import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ImagePlus, X } from "lucide-react";

export const CreatePostPage = () => {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("caption", caption);

    try {
      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-neutral-900 rounded-2xl shadow-sm border border-neutral-800 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-white mb-6 tracking-tight border-b border-neutral-800 pb-4">Create New Post</h1>
        
        {error && (
          <div className="mb-6 p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Photo</label>
            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-700 rounded-2xl p-12 text-center cursor-pointer hover:bg-neutral-800/50 hover:border-neutral-500 transition-all flex flex-col items-center justify-center min-h-[300px]"
              >
                <ImagePlus size={48} className="text-neutral-500 mb-4" />
                <p className="text-white font-medium mb-1">Click to select an image</p>
                <p className="text-sm text-neutral-500">PNG, JPG up to 5MB</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-neutral-950 aspect-square sm:aspect-[4/5] flex items-center justify-center border border-neutral-800">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={4}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2.5 text-sm font-medium text-neutral-300 hover:text-white bg-transparent rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !imageFile}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
