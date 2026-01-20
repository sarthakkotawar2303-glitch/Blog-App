import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../Banner/banner";
import { API } from "../service/api";


const categories = [
  "Technology",
  "Education",
  "Geopolitics",
  "Movies",
  "Music",
  "Web Devlopment",
  "Machine Learning",
  "Software development"
]

const Home = () => {

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const allposts = await API.Posts();


        if (allposts.isSuccess) {
          setPosts(allposts.data.posts); // ✅ THIS IS THE ARRAY
        } else {
          setError("Failed to fetch posts");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    console.log("Posts updated:", posts);
  }, [posts]);










  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter posts by category
  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Banner */}
      <Banner />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* FLEX ROW */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT - Category */}
          <div className="lg:w-1/4 w-full bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>

            {/* Horizontal Category List */}
            <ul className="flex flex-wrap gap-2">
              <li
                className={`px-4 py-2 rounded-full cursor-pointer ${selectedCategory === "All"
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-gray-700 hover:bg-blue-500 hover:text-white"
                  }`}
                onClick={() => setSelectedCategory("All")}
              >
                All
              </li>
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`px-4 py-2 rounded-full cursor-pointer ${selectedCategory === cat
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT - Posts */}
          <div className="lg:w-3/4 w-full bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6">
              {selectedCategory} Posts
            </h2>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex bg-gray-800/90 rounded-xl overflow-hidden 
             border border-gray-700/50 
             hover:border-blue-500/40 hover:shadow-xl 
             transition-all duration-300"
                >
                  {/* LEFT - IMAGE */}
                  <div className="w-2/5 relative overflow-hidden">
                    <img
                      src={post.coverImage.url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                  </div>

                  {/* RIGHT - CONTENT */}
                  <div className="w-3/5 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div>


                      <Link
                        to={`/posts/${post._id}`}
                        className="no-underline inline-flex items-center justify-center 
  bg-blue-600 hover:bg-blue-700 
  text-white text-sm font-medium 
  px-4 py-2 rounded-lg 
  transition-colors duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>

              ))}

              {filteredPosts.length === 0 && (
                <p className="text-gray-300 col-span-full text-center">
                  No posts available in this category.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
