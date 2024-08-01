import { components } from "./akaswap-api-v2";

export type Token = components["schemas"]["Fa2TokenDto"];

export type TezosAddress = `KT${string}` | `tz${string}`;

export enum MediaLevel {
  "thumbnail",
  "display",
  "artifact",
}

export enum MediaType {
  "BMP" = "image/bmp",
  "GIF" = "image/gif",
  "JPEG" = "image/jpeg",
  "PNG" = "image/png",
  "SVG" = "image/svg+xml",
  "WEBP" = "image/webp",
  "MP4" = "video/mp4",
  "OGV" = "video/ogg",
  "QUICKTIME" = "video/quicktime",
  "WEBM" = "video/webm",
  "GLB" = "model/gltf-binary",
  "GLTF" = "model/gltf+json",
  // "GLB"= ".glb",
  "MP3" = "audio/mpeg",
  "OGA" = "audio/ogg",
  "PDF" = "application/pdf",
  "X_DIRECTORY" = "application/x-directory",
  "ZIP" = "application/zip",
  "ZIP1" = "application/x-zip-compressed",
  "ZIP2" = "multipart/x-zip",
}

export type WalletProps = {
  wallet: string;
  alias?: string;
  full?: boolean;
  digits?: number;
};
