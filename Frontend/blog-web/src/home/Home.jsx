import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Banner from "../Banner/banner";
import { API } from "../service/api";
import { FiGrid, FiArrowRight, FiSearch, FiClock, FiInbox } from "react-icons/fi";
import moment from "moment";

const categories = [
  "Technology",
  "Education",
  "Geopolitics",
  "Movies",
  "Music",
  "Web Devlopment",
  "Machine Learning",
  "Software development",
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const allposts = await API.Posts();
        if (allposts?.isSuccess) {
          setPosts(allposts.data.posts || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ✅ Improved Smart Search + Category Filter
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" ||
        post?.category?.toLowerCase() === selectedCategory.toLowerCase();

      if (!query) return matchesCategory;

      const searchableText = `
        ${post?.title || ""}
        ${post?.description || ""}
        ${post?.excerpt || ""}
        ${post?.category || ""}
      `.toLowerCase();

      const matchesSearch = searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 font-sans">
      <Banner />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* SIDEBAR */}
          <aside className="lg:w-1/4 w-full">
            <div className="sticky top-24 space-y-8">

              {/* SEARCH */}
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search articles..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 
                             focus:outline-none focus:ring-2 focus:ring-blue-500/40 
                             transition-all text-sm text-white"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* CATEGORY FILTER */}
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-sm shadow-sm">
                <h2 className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                  <FiGrid className="text-blue-500" /> Browse
                </h2>

                <div className="flex flex-wrap lg:flex-col gap-1.5">
                  {["All", ...categories].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                        selectedCategory === cat
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {cat === "All" ? "All Stories" : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN FEED */}
          <main className="lg:w-3/4 w-full">
            <header className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {selectedCategory}
              </h2>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-slate-900/50 rounded-lg border border-slate-800">
                {filteredPosts.length} Articles
              </span>
            </header>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-80 bg-slate-900/50 animate-pulse rounded-[2.5rem]"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post) => (
                    <div
                      key={post._id}
                      className="group flex flex-col bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-900/60 shadow-sm"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.8rem] mb-6 shadow-md">
                        <img
                          src={post?.coverImage?.url}
                          alt={post?.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a]/60 via-transparent to-transparent opacity-60" />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase rounded-lg">
                          {post?.category}
                        </span>
                      </div>

                      <div className="px-2 pb-2 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-3">
                          <FiClock className="text-blue-500" />
                          {moment(post?.createdAt).fromNow()}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                          {post?.title}
                        </h3>

                        <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed flex-grow">
                          {post?.excerpt || post?.description}
                        </p>

                        <Link
                          to={`/posts/${post?._id}`}
                          className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest hover:gap-4 hover:text-blue-400 transition-all no-underline w-fit"
                        >
                          Read More <FiArrowRight />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="py-24 px-6 text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800/60">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-6 text-slate-600">
                      <FiInbox size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      No articles found
                    </h3>
                    <p className="text-slate-500">
                      No results for "{searchQuery}"
                    </p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;  