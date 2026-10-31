// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     open: true,
//     hmr: false
//   }
// })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     open: true,
//     host: true,     // لازم يكون true عشان HMR يشتغل على كل interfaces
//     hmr: false
//   }
// })
// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react() , tailwindcss()],
//   server: {
//     open:true ,
//     host: true,         // يسمح بالوصول لأي IP، مش بس localhost
//     port: 5173,         // أو أي بورت تحبه
//     strictPort: false,  // لو البورت مش فاضي، Vite يختار بورت آخر بدل ما يفشل
//     hmr: {
//       host: '127.0.0.1', // ممكن تغيره لـ IP جهازك على الشبكة لو عايز تفتح على تليفون
//       protocol: 'ws',
//     },
//   },
// })
// import { defineConfig } from 'vite'
// import tailwindcss from "@tailwindcss/vite"
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     open : true,
//     host: true,        // يسمح لأي IP بالاتصال بالسيرفر
//     port: 5173,        // البورت اللي هتشغّل عليه
//     strictPort: false,
//     hmr: {
//       host: '127.0.0.1', // لو هتشغل على نفس الجهاز، أو خلي IP اللابتوب على الـ hotspot
//       protocol: 'ws',     // WebSocket
//     },
//   },
// })
import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react() , tailwindcss()],
  server: {
    port: 5171,
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
});
