import { useEffect, useState } from "react";
import { API } from "../service/api";
import { FiEdit, FiTrash2, FiEye, FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import backgroundImage from '../assets/backgroundImage.png';

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
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center bg-[#0b0f1a]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen bg-[#0b0f1a]/85 py-12 px-6">
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter">My Library</h1>
              <div className="h-1.5 w-16 bg-blue-600 rounded-full mt-3 mb-2"></div>
              <p className="text-slate-400 font-medium">Manage and review your published articles</p>
            </div>
            <button 
              onClick={() => navigate('/create')}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold uppercase text-[11px] tracking-[0.2em] transition-all shadow-2xl shadow-blue-900/40 active:scale-95"
            >
              <FiPlus className="text-lg" /> New Article
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-6"></div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Fetching Content...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-[2rem] text-center mb-10">
              {error}
            </div>
          )}

          {!loading && !error && myposts.length === 0 && (
            <div className="text-center py-32 bg-slate-900/40 rounded-[3rem] border border-dashed border-slate-800">
              <p className="text-slate-500 text-lg">Your library is currently empty.</p>
            </div>
          )}

          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {myposts.map((post) => (
              <article
                key={post._id}
                className="group flex flex-col bg-[#1e293b]/80 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-[2.2rem] m-2 shadow-2xl">
                  {post.coverImage?.url ? (
                    <img
                      src={post.coverImage.url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800/50 flex items-center justify-center text-slate-600 italic text-sm">
                      No Cover Image
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                      {post.category || 'General'}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                      {moment(post.createdAt).fromNow()}
                    </p>
                    <h2 className="text-2xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/posts/${post._id}`} 
                        className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                        title="View Post"
                      >
                        <FiEye size={18} />
                      </Link>
                      <button
                        onClick={() => navigate(`/edit-post/${post._id}`)}
                        className="p-3 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-full transition-all"
                        title="Edit Post"
                      >
                        <FiEdit size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                      title="Delete Post"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPost;
