import { Vector3 } from 'three'
import type { BuildingData } from '@/types/building'

export const BUILDINGS_DATA: BuildingData[] = [
  {
    id: 'main-building',
    name: '总部大楼',
    type: '办公建筑',
    area: '25,000㎡',
    floors: '12层',
    status: '使用中',
    description: '园区核心建筑，集办公、会议、展示于一体。采用现代化设计理念，配备智能楼宇管理系统，实现能耗优化和绿色环保。',
    position: new Vector3(0, 3, 0),
    size: new Vector3(8, 6, 8)
  },
  {
    id: 'tech-center',
    name: '技术创新中心',
    type: '研发建筑',
    area: '18,000㎡',
    floors: '8层',
    status: '使用中',
    description: '专注于前沿技术研发，设有多个实验室和创新工作室。配备先进的研发设备和协作空间，为科研团队提供理想的工作环境。',
    position: new Vector3(-15, 2.5, 8),
    size: new Vector3(6, 5, 6)
  },
  {
    id: 'data-center',
    name: '数据中心',
    type: '基础设施',
    area: '8,000㎡',
    floors: '3层',
    status: '运行中',
    description: '园区数据处理核心，采用高可用性架构设计。配备双路供电、精密空调和消防系统，确保数据安全和业务连续性。',
    position: new Vector3(15, 1.5, -10),
    size: new Vector3(5, 3, 5)
  },
  {
    id: 'incubator',
    name: '创业孵化器',
    type: '孵化建筑',
    area: '12,000㎡',
    floors: '5层',
    status: '招租中',
    description: '为初创企业提供办公空间和创业支持服务。配备共享会议室、休闲区和导师辅导机制，助力创新企业发展。',
    position: new Vector3(-12, 2, -12),
    size: new Vector3(7, 4, 5)
  },
  {
    id: 'service-center',
    name: '服务中心',
    type: '配套建筑',
    area: '6,000㎡',
    floors: '2层',
    status: '使用中',
    description: '园区综合服务设施，包含餐厅、咖啡厅、健身房和便利店。为园区员工提供便捷的生活服务，营造舒适的工作氛围。',
    position: new Vector3(12, 1, 15),
    size: new Vector3(6, 2, 6)
  }
]
