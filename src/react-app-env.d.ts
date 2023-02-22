/// <reference types="react-scripts" />

interface Window {
    ethereum: any
}

declare module "*.json" {
    const value: any;
    export default value;
}