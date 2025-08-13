import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
appId: 'com.hiperlopez.dhammachat',
appName: 'dhamma-chat-ai',
webDir: 'dist',
server: {
url: 'https://48a43bd1-4a6d-42b9-b24c-5d5ac59f991e.lovableproject.com?forceHideBadge=true',
cleartext: true
}
};

export default config;