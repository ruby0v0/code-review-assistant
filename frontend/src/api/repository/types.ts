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

/** 获取单个文件内容参数 */
export interface RepositoryFileParams {
  /** 仓库所有者 */
  owner: string
  /** 仓库名称 */
  repo: string
  /** 文件路径 */
  filepath: string
  /** 分支名称 */
  branch?: string
}
