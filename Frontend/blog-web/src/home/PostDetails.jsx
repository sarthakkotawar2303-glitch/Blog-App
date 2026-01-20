import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../service/api";
import CommentSection from "./comments";

const ReadMore = () => {
  const { id } = useParams();
  console.log(id)

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single post
  useEffect(() => {
    const fetchSinglePost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.getPostById({id:id});
        
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-300 text-xl">
        Loading post...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      {post && (
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Cover Image */}
          {post.coverImage?.url && (
            <img
              src={post.coverImage.url}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          )}

          {/* Content */}
          <div className="p-8 space-y-6">
            <h1 className="text-4xl font-extrabold tracking-wide">
              {post.title}
            </h1>

            {/* Author info */}
            <p className="text-gray-400 text-sm">
              Created By:{" "}
              <span className="text-gray-200 font-medium">
                {post.author?.username || "Unknown"}
              </span>
              <br />
              Email:{" "}
              <span className="text-gray-200 font-medium">
                {post.author?.email || "Unknown"}
              </span>
            </p>

            {/* Description */}
            <div className="text-gray-200 leading-relaxed text-lg whitespace-pre-line">
              {post.description}
            </div>

            {/* Comments */}
            <div className="mt-10">
              <CommentSection id={id} />

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadMore;
