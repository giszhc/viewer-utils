import {defineConfig} from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'ViewerUtils',
            fileName: 'viewer-utils',
            formats: ['es']
        }
    }
})
