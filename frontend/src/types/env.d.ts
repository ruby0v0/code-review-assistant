interface ImportMetaEnv {
  /** 后端服务地址 */
  readonly VITE_API_URL: string
  /** 后端服务端口 */
  readonly VITE_API_PORT: string
  /** 后端服务前缀 */
  readonly VITE_API_PREFIX: string
  /** 公共基础路径 */
  readonly VITE_APP_PUBLIC_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
