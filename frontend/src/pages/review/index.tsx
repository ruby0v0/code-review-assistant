import type { ReviewFileResult } from '@/api/review/types'
import { Tabs } from 'antd'
import { useState } from 'react'
import BatchReview from './components/BatchReview'
import ReviewResult from './components/ReviewResult'
import SingleReview from './components/SingleReview'

const { TabPane } = Tabs

function ReviewPage() {
  const [reviewResult, setReviewResult] = useState<ReviewFileResult>()

  return (
    <>
      <Tabs>
        <TabPane tab="单个文件审查" key="single">
          <SingleReview onUpdateResult={setReviewResult} />
        </TabPane>
        <TabPane tab="批量审查" key="batch">
          <BatchReview />
        </TabPane>
      </Tabs>
      {/* 审查结果 */}
      <ReviewResult reviewResult={reviewResult} />
    </>
  )
}

export default ReviewPage
