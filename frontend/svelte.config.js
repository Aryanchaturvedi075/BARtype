import adapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({ out: "build", precompress: true, envPrefix: "PUBLIC_" }),
    inlineStyleThreshold: 5000,
  },
};

export default config;
