/** 单个文件审查请求参数 */
export interface ReviewFileParams {
  /** 仓库所有者 */
  owner: string
  /** 仓库名称 */
  repo: string
  /** 文件路径 */
  filepath: string
  /** 分支名称 */
  branch?: string
  /** 代码内容 */
  code?: string
}

/** 单个文件审查返回值 */
export interface ReviewFileResult {
  filepath: string
  content: string
  review: string
  timestamp: string
}
