import {defineConfig} from "cypress";
import {config} from "dotenv";

config();

export default defineConfig({
    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL,
    },

    env: {
        MAILOSAUR_API_KEY: process.env.CYPRESS_MAILOSAUR_API_KEY,
        USERNAME: process.env.CYPRESS_USERNAME,
        PASSWORD: process.env.CYPRESS_PASSWORD,
        EMAIL: process.env.CYPRESS_EMAIL,
        MAILOSAUR_SERVER_ID: process.env.CYPRESS_MAILOSAUR_SERVER_ID,
    },

    component: {
        devServer: {
            framework: "react",
            bundler: "vite",
        },
    },
});
