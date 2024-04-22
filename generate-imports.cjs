const fs = require('fs');
const path = require('path');

const rootDir = process.argv[2];

if (!rootDir) {
    console.error('Please provide a root directory as an argument.');
    process.exit(1);
}

const getSvgFilesInDir = (dir) => {
    return fs.readdirSync(dir).filter(file => {
        const ext = path.extname(file);
        return ['.png', '.svg', '.gif', '.webp', '.jpeg', '.jpg'].includes(ext);
    }).map(file => path.join(dir, file))
};

const generateNamespaceExportsForDir = (dir) => {
    const svgFiles = getSvgFilesInDir(dir);

    if (svgFiles.length === 0) return; // Skip folders without SVGs

    const namespaceExports = svgFiles.map(file => {
        const variableName = path.basename(file, path.extname(file)).replace(/-([a-z])/g, (_, g) => g.toUpperCase()); // Convert kebab-case to camelCase
        return `export * as ${variableName} from './${path.basename(file)}';`;
    }).join('\n');

    const outputPath = path.join(dir, 'index.ts');
    fs.writeFileSync(outputPath, namespaceExports, 'utf-8');
};

const walkDirectories = (dir) => {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat && stat.isDirectory()) {
            generateNamespaceExportsForDir(itemPath);
            walkDirectories(itemPath);
        }
    }
};

generateNamespaceExportsForDir(rootDir);  // Generate for rootDir itself
walkDirectories(rootDir);                 // Then walk its subdirectories
