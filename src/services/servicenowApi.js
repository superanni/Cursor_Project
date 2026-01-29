import axios from 'axios'

// ServiceNow API 配置
const SERVICENOW_CONFIG = {
  // 请替换为你的 ServiceNow 实例地址
  baseURL: import.meta.env.VITE_SERVICENOW_INSTANCE || 'https://your-instance.service-now.com',
  username: import.meta.env.VITE_SERVICENOW_USERNAME || '',
  password: import.meta.env.VITE_SERVICENOW_PASSWORD || ''
}

// 创建 axios 实例
const servicenowClient = axios.create({
  baseURL: SERVICENOW_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求拦截器 - 添加认证
servicenowClient.interceptors.request.use((config) => {
  // 使用 Basic Auth
  if (SERVICENOW_CONFIG.username && SERVICENOW_CONFIG.password) {
    const credentials = btoa(`${SERVICENOW_CONFIG.username}:${SERVICENOW_CONFIG.password}`)
    config.headers.Authorization = `Basic ${credentials}`
  }
  return config
})

// 响应拦截器 - 处理错误
servicenowClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('ServiceNow API Error:', error.response?.data || error.message)
    throw error
  }
)

/**
 * ServiceNow API 服务
 */
export const ServiceNowAPI = {
  /**
   * 创建事件工单 (Incident)
   * @param {Object} ticketData - 工单数据
   * @returns {Promise} 创建的工单
   */
  async createIncident(ticketData) {
    const payload = {
      short_description: ticketData.title,
      description: ticketData.description,
      urgency: ticketData.urgency || '3', // 1=高, 2=中, 3=低
      impact: ticketData.impact || '3',
      category: ticketData.category || 'inquiry',
      subcategory: ticketData.subcategory || '',
      caller_id: ticketData.callerId || '',
      assignment_group: ticketData.assignmentGroup || '',
      // AI 分析结果
      work_notes: ticketData.aiAnalysis ? `[AI分析结果]\n${ticketData.aiAnalysis}` : ''
    }

    const response = await servicenowClient.post('/api/now/table/incident', payload)
    return response.data.result
  },

  /**
   * 上传附件到工单
   * @param {string} tableName - 表名 (如 'incident')
   * @param {string} sysId - 工单 sys_id
   * @param {File} file - 文件对象
   * @returns {Promise} 上传结果
   */
  async uploadAttachment(tableName, sysId, file) {
    const formData = new FormData()
    formData.append('uploadFile', file)

    const response = await servicenowClient.post(
      `/api/now/attachment/file?table_name=${tableName}&table_sys_id=${sysId}&file_name=${encodeURIComponent(file.name)}`,
      file,
      {
        headers: {
          'Content-Type': file.type || 'application/octet-stream'
        }
      }
    )
    return response.data.result
  },

  /**
   * 批量上传附件
   * @param {string} tableName - 表名
   * @param {string} sysId - 工单 sys_id
   * @param {File[]} files - 文件数组
   * @returns {Promise} 上传结果数组
   */
  async uploadMultipleAttachments(tableName, sysId, files) {
    const uploadPromises = files.map(file => this.uploadAttachment(tableName, sysId, file))
    return Promise.all(uploadPromises)
  },

  /**
   * 获取工单列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 工单列表
   */
  async getIncidents(params = {}) {
    const queryParams = new URLSearchParams({
      sysparm_limit: params.limit || 20,
      sysparm_offset: params.offset || 0,
      sysparm_display_value: 'true',
      sysparm_query: params.query || 'ORDERBYDESCsys_created_on'
    })

    const response = await servicenowClient.get(`/api/now/table/incident?${queryParams}`)
    return response.data.result
  },

  /**
   * 获取单个工单详情
   * @param {string} sysId - 工单 sys_id
   * @returns {Promise} 工单详情
   */
  async getIncidentById(sysId) {
    const response = await servicenowClient.get(
      `/api/now/table/incident/${sysId}?sysparm_display_value=true`
    )
    return response.data.result
  },

  /**
   * 更新工单
   * @param {string} sysId - 工单 sys_id
   * @param {Object} updateData - 更新数据
   * @returns {Promise} 更新后的工单
   */
  async updateIncident(sysId, updateData) {
    const response = await servicenowClient.patch(
      `/api/now/table/incident/${sysId}`,
      updateData
    )
    return response.data.result
  },

  /**
   * 获取工单的附件列表
   * @param {string} sysId - 工单 sys_id
   * @returns {Promise} 附件列表
   */
  async getAttachments(sysId) {
    const response = await servicenowClient.get(
      `/api/now/attachment?sysparm_query=table_sys_id=${sysId}`
    )
    return response.data.result
  },

  /**
   * 获取分类选项
   * @returns {Promise} 分类列表
   */
  async getCategories() {
    // 这里返回预设的分类，实际可以调用 ServiceNow 的 choice API
    return [
      { value: 'inquiry', label: '咨询' },
      { value: 'software', label: '软件问题' },
      { value: 'hardware', label: '硬件问题' },
      { value: 'network', label: '网络问题' },
      { value: 'database', label: '数据库问题' },
      { value: 'security', label: '安全问题' },
      { value: 'other', label: '其他' }
    ]
  }
}

export default ServiceNowAPI

