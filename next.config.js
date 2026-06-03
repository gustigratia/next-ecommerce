/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    // DB_URI: "mongodb+srv://divyagaurav1602045:PwR2GUxnJWMJo7vS@cluster0.g6en0r5.mongodb.net/?retryWrites=true&w=majority",
    DB_URI:
      'mongodb+srv://gustigratia:delpiera06@cluster0.kuaeyei.mongodb.net/ecommerce?appName=Cluster0',
    API_URL: 'http://localhost:3000',
  },
};

module.exports = nextConfig;

// Username = "divyagaurav1602045"
//password = "PwR2GUxnJWMJo7vS"
// mongodb+srv://divyagaurav1602045:<password>@cluster0.g6en0r5.mongodb.net/?retryWrites=true&w=majority

// DB_URI: "mongodb://127.0.0.1:27017/next-eccomerce",

// mongodb+srv://divyagaurav:divyagaurav@cluster1.ispjeaf.mongodb.net/?retryWrites=true&w=majority
