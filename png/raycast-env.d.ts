/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-assets` command */
  export type SearchAssets = ExtensionPreferences & {
  /** GitHub Repository - Repository in format: owner/repo-name */
  "githubRepo": string,
  /** GitHub Branch - Branch to load metadata from */
  "githubBranch": string
}
}

declare namespace Arguments {
  /** Arguments passed to the `search-assets` command */
  export type SearchAssets = {}
}

