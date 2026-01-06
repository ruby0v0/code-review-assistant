import type { RepositoryFileContentParams, RepositoryFilesParams, RepositoryFilesResult, RepositoryInfo, RepositoryInfoParams } from './types'
import request from '../../utils/request/index'

/**
 * 获取仓库信息
 */
export function fetchRepositoryInfo(params: RepositoryInfoParams): Promise<RepositoryInfo> {
  return request.get('/repository/info', { params })
}

/**
 * 获取文件列表
 */
export function fetchRepositoryFiles(params: RepositoryFilesParams): Promise<RepositoryFilesResult> {
  return request.get('/repository/files', { params })
}

/**
 * 获取单个文件内容
 */
export function fetchRepositoryFileContent(params: RepositoryFileContentParams) {
  return request.get('/repository/file', { params })
}
