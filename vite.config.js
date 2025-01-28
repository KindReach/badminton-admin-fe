import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
            "@components": resolve(__dirname, "src/components"),
            "@images": resolve(__dirname, "src/assets/images"),
            "@assests": resolve(__dirname, "src/assets"),
            "@pages": resolve(__dirname, "src/pages"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"], // 將 React 相關庫分離
                },
            },
        },
    },
});
