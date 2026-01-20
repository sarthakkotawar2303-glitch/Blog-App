import {
  FaLayerGroup,
  FaLaptopCode,
  FaBookOpen,
  FaFilm,
  FaFutbol,
  FaMusic,
} from "react-icons/fa";

const categories = [
  { name: "All", icon: FaLayerGroup },
  { name: "Tech", icon: FaLaptopCode },
  { name: "Education", icon: FaBookOpen },
  { name: "Movies", icon: FaFilm },
  { name: "Sports", icon: FaFutbol },
  { name: "Music", icon: FaMusic },
];

const Category = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
      {categories.map(({ name, icon: Icon }) => {
        const active = selectedCategory === name;

        return (
          <button
            key={name}
            onClick={() => onSelectCategory(name)}
            className={`flex flex-col items-center justify-center gap-3
              px-4 py-6 rounded-2xl text-sm font-semibold
              transition-all duration-300
              ${
                active
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl scale-105"
                  : "bg-gray-700/70 text-gray-300 hover:bg-gray-600"
              }`}
          >
            <Icon className={`text-2xl ${active ? "text-white" : "text-indigo-400"}`} />
            <span>{name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Category;
