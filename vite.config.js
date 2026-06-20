import { defineConfig } from 'vite';

export default defineConfig({
  // Using relative base path makes the build work whether hosted at 
  // user.github.io/ or user.github.io/portfolio/
  base: './',
  build: {
    outDir: 'dist',
  }
});
