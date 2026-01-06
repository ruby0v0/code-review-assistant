/** 获取仓库信息参数 */
export interface RepositoryInfoParams {
  /** 仓库所有者 */
  owner: string
  /** 仓库名称 */
  repo: string
}

/** 获取仓库信息返回值 */
export interface RepositoryInfo {
  name: string
  fullName: string
  /** 仓库描述 */
  description: string | null
  /** 仓库语言 */
  language: string | null
  /** 仓库 star 数 */
  stars: number
  /** 仓库 fork 数 */
  forks: number
  /** 仓库默认分支 */
  defaultBranch: string
  /** 仓库更新时间 */
  updateAt: string
}

/** 获取仓库文件列表参数 */
export interface RepositoryFilesParams {
  /** 仓库所有者 */
  owner: string
  /** 仓库名称 */
  repo: string
  /** 分支名称 */
  branch?: string
}

/** 仓库文件列表 */
export interface RepositoryFiles {
  /** 文件路径 */
  path: string
  /** 文件  */
  sha: string
  /** 文件大小 */
  size?: number
  /** 文件类型 */
  type: string
}

/** 仓库文件类型 */
export type RepositoryFileType = 'javascript' | 'typescript' | 'css' | 'html' | 'json'

/** 仓库文件类型统计 */
export type RepositoryFilesStats = Record<RepositoryFileType, number>

/** 获取仓库文件列表结果 */
export interface RepositoryFilesResult {
  /** 文件总数 */
  total: number
  /** 文件类型统计 */
  stats: RepositoryFilesStats
  /** 文件列表 */
  files: RepositoryFiles[]
}

/** 获取单个文件内容参数 */
export interface RepositoryFileContentParams {
  /** 仓库所有者 */
  owner: string
  /** 仓库名称 */
  repo: string
  /** 文件路径 */
  filepath: string
  /** 分支名称 */
  branch?: string
}
