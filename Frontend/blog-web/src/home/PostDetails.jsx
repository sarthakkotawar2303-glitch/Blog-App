import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../service/api";
import CommentSection from "./comments";
import moment from "moment";
import backgroundImage from '../assets/backgroundImage.png'; 

const ReadMore = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSinglePost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.getPostById({ id: id });
        if (response.data.success) {
          setPost(response.data.post);
        } else {
          setError(response.data.message || "Post not found");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSinglePost();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#0b0f1a]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-fixed bg-cover bg-center bg-[#0b0f1a] font-sans"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen bg-[#0b0f1a]/90 py-20 px-6">
        
        {post && (
          <article className="max-w-5xl mx-auto relative z-10">

            <header className="mb-16">
              <div className="inline-block px-5 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full mb-8">
                <span className="text-blue-400 text-[11px] font-black uppercase tracking-[0.4em]">
                  {post.category || "Insight"}
                </span>
              </div>
              
              {/* Cleaned up Title Typography */}
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-10">
                {post.title}
              </h1>

              {/* --- STYLISH EXCERPT --- */}
              {post.excerpt && (
                <div className="max-w-4xl mb-12 border-l-2 border-blue-500/50 pl-8 py-1">
                  <p className="text-slate-300 text-2xl md:text-3xl font-light italic leading-relaxed opacity-90">
                    {post.excerpt}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-6 py-10 border-y border-white/5">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                  {post.author?.username?.charAt(0) || "S"}
                </div>
                <div>
                  <p className="text-white text-lg font-bold tracking-tight">
                    {post.author?.username || "ScribleSpace Author"}
                  </p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                    {moment(post.createdAt).format("MMMM Do, YYYY")} • 5 min read
                  </p>
                </div>
              </div>
            </header>

            {post.coverImage?.url && (
              <div className="rounded-[3rem] overflow-hidden shadow-2xl mb-20 border border-white/5 bg-slate-950">
                <img
                  src={post.coverImage.url}
                  alt={post.title}
                  className="w-full h-auto max-h-[700px] object-cover"
                />
              </div>
            )}

            {/* --- MAIN CONTENT: Clean & Large Typography --- */}
            <div className="relative">
              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-12 md:p-24 rounded-[3.5rem] shadow-2xl">
                <div className="prose prose-invert prose-2xl max-w-none">
                  {/* Removed the big 'first-letter' font for a cleaner start */}
                  <p className="text-slate-200 leading-[2] text-xl md:text-2xl font-normal whitespace-pre-line">
                    {post.description}
                  </p>
                </div>
              </div>
            </div>

            <section className="mt-32">
              <div className="flex items-center gap-6 mb-12 px-4">
                <h3 className="text-3xl font-bold text-white tracking-tight">Conversation</h3>
                <div className="flex-grow h-px bg-white/10"></div>
              </div>
              
              <div className="bg-white/[0.02] backdrop-blur-md rounded-[2.5rem] p-6 md:p-10 border border-white/5">
                <CommentSection id={id} />
              </div>
            </section>
            
          </article>
        )}
      </div>
    </div>
  );
};

export default ReadMore;
