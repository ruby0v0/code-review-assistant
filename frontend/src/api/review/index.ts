import type { ReviewFileParams, ReviewFileResult } from './types'
import request from '../../utils/request'

/**
 * 单个文件审查
 */
export function reviewFileApi(params: ReviewFileParams): Promise<ReviewFileResult> {
  return request.post('/review/single', params)
}
