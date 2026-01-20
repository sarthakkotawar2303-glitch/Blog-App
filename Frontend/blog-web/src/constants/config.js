export const API_NOTIFICATION_MESSAGES = {
  loading: {
    title: "Loading...",
    message: "Data being loaded, please wait"
  },
  success: {
    title: "Success",
    message: "Data successfully loaded"
  },
  responseFailure: {
    title: "Error",
    message: "An error occurred while fetching response from the server. Please try again"
  },
  requestFailure: {
    title: "Error",
    message: "An error occurred while parsing request data"
  },
  networkError: {
    title: "Error",
    message: "Unable to connect to the server. Please check your internet connectivity"
  }
};

export const SERVICE_URLS = {

  //login  
  userSignup: { url: '/auth/signup', method: 'POST' },
  userLogin: { url: '/auth/login', method: 'POST' },
  
  //posts
  publishBlog: { url: '/posts/create', method: 'POST' },
  Posts: { url: '/posts/allPosts', method: 'GET' },
  getPostById: { url: (id) => `/posts/getPost/${id}`, method: 'GET' },
  deletePost: { url: (id) => `/posts/deletePost/${id}`, method: 'DELETE' },
  updatePost: { url: (id) => `/posts/${id}/updatePost`, method: "PUT", params: true },
  myPosts: { url: `/posts/getMyPosts`, method: "GET" },

  //comments
  addComment: { url: (id) => `/posts/${id}/comments`, method: "POST", hasParams: true },
  getComments: { url: (id) => `/posts/${id}/comments`, method: "GET" },
  updateComment: { url: (id) => `/posts/${id}/comments`, method: "PUT", hasParams: true },
  deleteComment: { url: (id) => `/posts/delete/${id}`, method: "DELETE" },
};
