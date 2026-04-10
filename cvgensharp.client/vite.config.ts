import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "cvgensharp.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const aspNetCoreUrls = env.ASPNETCORE_URLS?.split(';').filter(url => url);
const aspNetCoreHttpPorts = env.ASPNETCORE_HTTP_PORTS?.split(';').filter(port => port);
const aspNetCoreHttpsPorts = env.ASPNETCORE_HTTPS_PORTS?.split(';').filter(port => port);
const aspNetCoreHttpUrl = aspNetCoreUrls?.find(url => url.startsWith('http://'));
const aspNetCoreHttpsUrl = aspNetCoreUrls?.find(url => url.startsWith('https://'));
const explicitBackendUrl = env.VITE_BACKEND_URL;
const aspNetCoreHttpUrlFromPorts = aspNetCoreHttpPorts?.[0] ? `http://localhost:${aspNetCoreHttpPorts[0]}` : undefined;
const aspNetCoreHttpsUrlFromPorts = aspNetCoreHttpsPorts?.[0] ? `https://localhost:${aspNetCoreHttpsPorts[0]}` : undefined;

const target = explicitBackendUrl ??
    aspNetCoreHttpUrlFromPorts ??
    aspNetCoreHttpsUrlFromPorts ??
    aspNetCoreHttpUrl ??
    aspNetCoreHttpsUrl ??
    aspNetCoreUrls?.[0] ??
    (env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` : 'http://localhost:8080');

console.log(`[vite] backend proxy target: ${target}`);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/api': {
                target,
                changeOrigin: true,
                secure: false
            },
            '^/cvs': {
                target,
                changeOrigin: true,
                secure: false
            },
            '^/weatherforecast': {
                target,
                changeOrigin: true,
                secure: false
            }
        },
        port: parseInt(env.DEV_SERVER_PORT || '57830'),
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
