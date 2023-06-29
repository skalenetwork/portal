/// <reference types="react-scripts" />

interface Window {
    ethereum: any
    zE: any
}

declare module "*.json" {
    const value: any;
    export default value;
}