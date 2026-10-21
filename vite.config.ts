/** Build relative static assets and isolate model tests from browser tests. */
import { defineConfig } from 'vitest/config';
export default defineConfig({base:'./',test:{include:['tests/*.test.ts']}});
