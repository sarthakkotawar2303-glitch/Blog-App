import { useEffect, useState } from "react";
import { API } from "../service/api";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

const MyPost = () => {
  const [myposts, setMyposts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.myPosts();
        if (res.isSuccess) setMyposts(res.data.posts || []);
        else setError("Failed to fetch posts");
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await API.deletePost({ id });
      if (response?.data?.success) {
        setMyposts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(response?.data?.message || "Failed to delete post");
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Posts</h1>

        {loading && <p className="text-gray-400 text-center">Loading posts...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && myposts.length === 0 && (
          <p className="text-gray-400 text-center">You haven’t written any posts yet.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myposts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/50 
                         hover:border-blue-500/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="h-48 w-full overflow-hidden relative">
                {post.coverImage?.url ? (
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No Cover Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col justify-between">
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h2>

                <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
                  <span>{moment(post.createdAt).format("LL")}</span>
                  <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">
                    {post.category}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 text-gray-400">
                  <Link to={`/posts/${post._id}`} className="hover:text-blue-500 transition-colors">
                    <FiEye size={18} />
                  </Link>

                  <button
                    onClick={() => navigate(`/edit-post/${post._id}`)}
                    className="hover:text-green-500 transition-colors"
                  >
                    <FiEdit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPost;
