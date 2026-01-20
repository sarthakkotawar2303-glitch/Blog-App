import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../service/api";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [post, setPost] = useState({
    title: "",
    excerpt: "",
    description: "",
    category: "",
    coverImage: null, // can be string (URL) or File
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Fetch post by ID
  useEffect(() => {
    if (!id || id === "undefined") return;

    const fetchPost = async () => {
      try {
        const response = await API.getPostById({ id });
        if (response.isSuccess) {
          const data = response.data.post;
          setPost({
            title: data.title || "",
            excerpt: data.excerpt || "",
            description: data.description || "",
            category: data.category || "",
            coverImage: data.coverImage?.url || null,
          });
          if (data.coverImage?.url) setPreview(data.coverImage.url);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Cleanup preview URL
  useEffect(() => {
    return () => preview && typeof preview !== "string" && URL.revokeObjectURL(preview);
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost((prev) => ({ ...prev, coverImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setError("");

    if (!post.title.trim() || !post.description.trim() || !post.category) {
      setError("Title, description, and category are required");
      return;
    }

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("excerpt", post.excerpt);
      formData.append("description", post.description);
      formData.append("category", post.category);

      if (post.coverImage instanceof File) {
        formData.append("coverImage", post.coverImage);
      }

      const response = await API.updatePost({ id, data: formData });

      if (response.isSuccess) {
        navigate(`/posts/${id}`);
      } else {
        setError(response.msg || "Failed to update post");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">
        Loading post...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Post</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            name="title"
            value={post.title}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Excerpt */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Excerpt</label>
          <input
            name="excerpt"
            value={post.excerpt}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            name="description"
            rows={6}
            value={post.description}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <select
            name="category"
            value={post.category}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {[
              "Technology",
              "Education",
              "Geopolitics",
              "Movies",
              "Music",
              "Web Development",
              "Machine Learning",
              "Software development",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Image */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Cover Image</label>

          {preview && (
            <img
              src={preview}
              alt="cover"
              className="w-full h-48 object-cover rounded-xl mb-3 border border-gray-700"
            />
          )}

          <label
            className="flex items-center justify-center gap-2 w-full h-14
              border-2 border-dashed border-gray-600 rounded-xl
              cursor-pointer hover:border-blue-500 transition
              text-gray-400 hover:text-blue-400"
          >
            <span className="text-2xl font-bold">+</span>
            <span className="text-sm">Change Cover Image</span>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={updating}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
