declare module "*.png" {
  const value: any;
  export default value;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module '*.scss';

declare global {
  interface Window {
    ethereum: any;
  }
}