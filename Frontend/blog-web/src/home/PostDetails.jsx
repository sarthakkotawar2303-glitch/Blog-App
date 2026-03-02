import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../service/api";
import CommentSection from "./comments";
import moment from "moment";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="animate-pulse text-blue-500 text-lg font-medium">Reading Post...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500 px-4 text-center">
      <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 py-10 px-4">
      {post && (
        <article className="max-w-4xl mx-auto">
          {/* Header Section */}
          <header className="mb-8">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase rounded-full tracking-wider">
              {post.category || "Article"}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Enhanced Author Bar */}
            <div className="flex items-center gap-4 py-6 border-y border-slate-800">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl uppercase shadow-lg">
                {post.author?.username?.charAt(0) || "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold">
                  {post.author?.username || "Anonymous Writer"}
                </span>
                <span className="text-slate-400 text-sm italic">
                  {post.author?.email} • {moment(post.createdAt).format("LL")}
                </span>
              </div>
            </div>
          </header>

          {/* Cover Image with subtle shadow */}
          {post.coverImage?.url && (
            <div className="rounded-3xl overflow-hidden shadow-2xl mb-10 border border-slate-800">
              <img
                src={post.coverImage.url}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Main Content Body */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-line bg-slate-800/30 p-6 md:p-10 rounded-3xl border border-slate-800">
              {post.description}
            </div>
          </div>

          {/* Comments Section Container */}
          <section className="mt-16 pt-10 border-t border-slate-800">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
               Conversation
               <span className="h-1.5 w-1.5 bg-blue-500 rounded-full"></span>
            </h3>
            <div className="bg-slate-900/50 rounded-2xl p-2">
               <CommentSection id={id} />
            </div>
          </section>
        </article>
      )}
    </div>
  );
};

export default ReadMore;
