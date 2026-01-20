import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { API } from "../service/api";

const CreatePost = () => {
  const postInitialValue = {
    title: "",
    excerpt:"",
    description: "",
    category: "",
    coverImage: null,
  };

  const [post, setPost] = useState(postInitialValue);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onChangingFields = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost({ ...post, coverImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!post.title.trim() || !post.description.trim() || !post.category) {
      setError("All fields are required");
      return;
    }

    if (!post.coverImage) {
      setError("Cover image is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", post.title.trim());
      formData.append("excerpt", post.excerpt.trim());
      formData.append("description", post.description.trim());
      formData.append("category", post.category);
      formData.append("coverImage", post.coverImage);

      const response = await API.publishBlog(formData);

      if (response.isSuccess) {
        setPost(postInitialValue);
        setPreview(null);
        fileInputRef.current.value = "";
        alert("Post created successfully!");
      } else {
        setError(response.msg || "Something went wrong!");
      }
    } catch (err) {
      setError(err?.msg || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-fullmax-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-900 text-white min-h-screen">
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-4"
      >
        <h2 className="text-2xl font-semibold text-white">Create Post</h2>

        <input
          type="text"
          name="title"
          placeholder="Post title"
          value={post.title}
          onChange={onChangingFields}
          className="m-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <textarea
          name="excerpt"
          placeholder="Post excerpt"
          value={post.excerpt}
          onChange={onChangingFields}
          className="m-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 h-28 resize-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />

        <textarea
          name="description"
          placeholder="Post description"
          value={post.description}
          onChange={onChangingFields}
          className="m-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 h-28 resize-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />

        <select
          name="category"
          value={post.category}
          onChange={onChangingFields}
          className="m-2 w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select category</option>
          <option value="Technology">Technology</option>
          <option value="Education">Education</option>
          <option value="Food">Food</option>
          <option value="Web Development">Web Development</option>
          <option value="Music">Music</option>
          <option value="Geopolitics">Geopolitics</option>
          <option value="Software development">Software development</option>
          <option value="Machine Learning">Machine Learning</option>
          <option value="Movies">Movies</option>
        </select>

        {/* IMAGE UPLOAD */}
        <label
          htmlFor="imageUpload"
          className="w-full h-40 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="m-2 flex flex-col items-center text-gray-400">
              <FaPlus className="text-3xl" />
              <span className="mt-2 text-sm">Add Cover Image</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="m-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>

      {/* CARD PREVIEW */}
      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        {preview ? (
          <img src={preview} alt="cover" className="w-full h-56 object-cover" />
        ) : (
          <div className="h-56 bg-gray-700 flex items-center justify-center text-gray-400">
            Image Preview
          </div>
        )}

        <div className="p-5 space-y-2">
          <span className="text-sm text-blue-500 font-semibold">
            {post.category || "Category"}
          </span>
          <h3 className="text-xl font-bold text-white">
            {post.title || "Post Title"}
          </h3>
          <p className="text-gray-300 text-sm">
            {post.description || "Post description will appear here..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
