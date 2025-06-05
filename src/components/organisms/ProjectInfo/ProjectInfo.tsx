import React, { FC } from 'react'
import { Row, Col } from 'antd'
import { ContentCard, MarketPlace } from 'components'
import { ProjectInfoCard } from './organisms'

export const ProjectInfo: FC = () => {
  return (
    <Row gutter={[24, 24]} style={{ flexGrow: 1 }}>
      <Col span={13}>
        <ContentCard flexGrow={1}>
          <ProjectInfoCard />
        </ContentCard>
      </Col>
      <Col span={11}>
        <ContentCard flexGrow={1}>
          <MarketPlace />
        </ContentCard>
      </Col>
    </Row>
  )
}
