import { useEffect, useState } from "react";
import { API } from "../service/api";
import { FiEdit, FiTrash2, FiEye, FiPlus } from "react-icons/fi";
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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">My Library</h1>
            <p className="text-slate-400 mt-2">Manage and edit your published articles</p>
          </div>
          <button 
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
          >
            <FiPlus /> New Post
          </button>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-400">Loading your content...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {!loading && !error && myposts.length === 0 && (
          <div className="text-center py-20 bg-slate-800/50 rounded-3xl border border-dashed border-slate-700">
            <p className="text-slate-400 text-lg">You haven't written any posts yet.</p>
          </div>
        )}

        {/* Modern Grid Layout */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {myposts.map((post) => (
            <article
              key={post._id}
              className="group flex flex-col bg-[#1e293b] rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              {/* Image Container: Fixed 16:9 Aspect Ratio */}
              <div className="relative aspect-video w-full overflow-hidden">
                {post.coverImage?.url ? (
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                    No Cover Image
                  </div>
                )}
                {/* Category Overlay */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-md shadow-lg">
                    {post.category || 'General'}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  <p className="text-blue-400 text-xs font-medium mb-2">
                    {moment(post.createdAt).format("MMMM DD, YYYY")}
                  </p>
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-1">
                    <Link 
                      to={`/posts/${post._id}`} 
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                      title="View Post"
                    >
                      <FiEye size={20} />
                    </Link>
                    <button
                      onClick={() => navigate(`/edit-post/${post._id}`)}
                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                      title="Edit Post"
                    >
                      <FiEdit size={20} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete Post"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPost;
