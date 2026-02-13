/// <reference types="vite/client" />

declare namespace React {
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}

declare module 'react-router-dom' {
  export interface RouteObject {
    caseSensitive?: boolean
    children?: RouteObject[]
    element?: React.ReactNode
    index?: boolean
    path?: string
  }
}

declare module "*.svg" {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

declare module "*.mp3" {
  const content: string;
  export default content;
}

declare module "*.wav" {
  const content: string;
  export default content;
}

declare module "*.json" {
  const content: Record<string, unknown>;
  export default content;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}