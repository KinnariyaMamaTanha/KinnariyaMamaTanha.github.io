// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import astroIcon from 'astro-icon';
import playformCompress from "@playform/compress";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: "https://KinnariyaMamaTanha.github.io",
  base: "",
  output: 'static',
  integrations: [
    sitemap(),
    tailwind(),
    astroIcon({
      include: {
        mdi: ["*"],
        'ri': ['*'],
        'simple-icons': ['*'],
      },
    }),
    playformCompress({
      CSS: false,
      Image: false,
      Action: {
        Passed: async () => true,   // https://github.com/PlayForm/Compress/issues/376
      },
    })
  ],
});
