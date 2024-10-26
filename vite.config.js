import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        earphones: 'earphones.html',
        headphones: 'headphones.html',
        producEarphones: 'product-earphones.html',
        productXx59: 'product-xx59-headphones.html',
        productXx99: 'product-xx99-mark-one-headphones.html',
        productXx99: 'product-xx99-mark-two-headphones.html',
        productZx7: 'product-zx7-speaker.html',
        productZx9: 'product-zx9-speaker.html',
        speakers: 'speakers.html',
        checkout: 'checkout.html',
      },
    },
  },
});
