// // import axios from 'axios';

// // // إنشاء نسخة مخصصة من Axios برابط الباك-إند الأساسي
// // const api = axios.create({
// //   baseURL: 'http://localhost:8080', // عدله إذا كان السيرفر يعمل على رابط آخر
// // });

// // // إعداد الـ Interceptor لإضافة توكن الـ JWT تلقائياً قبل خروج أي طلب لـ مسار مؤمن
// // api.interceptors.request.use(
// //   (config) => {
// //     // جلب التوكن المخزن عند نجاح عملية الـ Login
// //     const token = localStorage.getItem('token');
    
// //     if (token) {
// //       // إرفاق التوكن في الـ Authorization Header بالشكل القياسي Bearer
// //       config.headers['Authorization'] = `Bearer ${token}`;
// //     }
    
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// // export default api;
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://gp-backend-production-7b9a.up.railway.app', 
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token'); 
    
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;