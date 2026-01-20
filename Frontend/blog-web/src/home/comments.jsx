import { useContext, useEffect, useState } from "react";
import { API } from "../service/api";
import { DataContext } from "../context/DataProvider";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import moment from "moment"; // for time formatting

const CommentSection = ({ id }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingLoading, setEditingLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { account } = useContext(DataContext);
  const currentUser = account || null;

  // ================= Fetch Comments =================
  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await API.getComments({ postId: id });
        if (res?.isSuccess) setComments(res.data?.comments || []);
        else setError("Failed to load comments");
      } catch {
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  // ================= Add Comment =================
  const handleSubmit = async () => {
    if (!text.trim()) return;

    setPosting(true);
    try {
      const res = await API.addComment({ postId: id, data: { text: text.trim() } });
      if (res?.isSuccess) {
        setComments((prev) => [res.data.comment, ...prev]);
        setText("");
      }
    } finally {
      setPosting(false);
    }
  };

  // ================= Delete Comment =================
  const handleDelete = async (commentId) => {
    
    try {
      const res = await API.deleteComment({ commentId });
      if (res?.isSuccess) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch {}
  };

  // ================= Edit Comment =================
  const handleEditSubmit = async (commentId) => {
    if (!editingText.trim()) return;

    setEditingLoading(true);
    try {
      const res = await API.updateComment({
        id, // post ID
        data: { commentId, text: editingText.trim() },
      });

      if (res?.isSuccess) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, text: editingText.trim() } : c))
        );
        setEditingId(null);
        setEditingText("");
      }
    } finally {
      setEditingLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-800 rounded-2xl shadow-md">
      <h3 className="text-2xl font-semibold text-white mb-6">Comments</h3>

      {/* Add Comment */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-600 rounded px-3 py-2 text-sm bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={posting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 transition"
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>

      {loading && <p className="text-gray-400 text-sm">Loading comments...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Comments */}
      <div className="space-y-4">
        {comments.map((comment) => {
          const commentUserId = typeof comment.user === "object" ? comment.user._id : comment.user;
          const isOwner = currentUser?.id === commentUserId;

          return (
            <div
              key={comment._id}
              className="bg-gray-700 p-4 rounded-lg shadow-sm relative"
            >
              {/* Author and time */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-400">{comment.user?.username || "Anonymous"}</span><br />
                  <span className="text-gray-400 text-xs">
                    {moment(comment.createdAt).fromNow()}
                  </span>
                </div>

                {/* Edit/Delete icons */}
                {isOwner && editingId !== comment._id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(comment._id);
                        setEditingText(comment.text);
                      }}
                      className="text-gray-400 hover:text-blue-400 transition"
                      title="Edit Comment"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      title="Delete Comment"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment text / Editing input */}
              {editingId === comment._id ? (
                <div className="mt-2 flex flex-col gap-2">
                  <input
                    autoFocus
                    className="w-full border border-gray-600 rounded px-2 py-1 text-sm bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEditSubmit(comment._id)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSubmit(comment._id)}
                      disabled={editingLoading}
                      className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50 transition text-sm"
                    >
                      <FiCheck />
                      {editingLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                      className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm transition"
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-gray-200">{comment.text}</p>
              )}
            </div>
          );
        })}
      </div>

      {!loading && comments.length === 0 && (
        <p className="text-gray-400 mt-4 text-sm">No comments yet</p>
      )}
    </div>
  );
};

export default CommentSection;
