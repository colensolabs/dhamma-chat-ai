import { defineConfig } from "@capacitor/cli";

export default defineConfig({
  appId: "app.lovable.48a43bd14a6d42b9b24c5d5ac59f991e",
  appName: "dhamma-chat-ai",
  webDir: "dist",
  server: {
    url: "https://48a43bd1-4a6d-42b9-b24c-5d5ac59f991e.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
});
