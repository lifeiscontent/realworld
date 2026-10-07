import type { Config } from '@react-router/dev/config';

// SPA mode: the build makes static files, and the app renders in the
// browser. The routes use clientLoader, clientAction, and clientMiddleware.
export default {
  appDirectory: 'src',
  ssr: false,
  future: {
    unstable_optimizeDeps: true,
  },
} satisfies Config;
