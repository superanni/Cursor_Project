# 🎫 智能工单系统

一个基于 React + Vite 的现代化工单管理系统，集成 ServiceNow API 和 AI 图片分析功能。

## ✨ 功能特性

- 🤖 **AI 智能分析** - 上传错误截图，AI 自动识别问题并提供解决建议
- 📎 **附件上传** - 支持拖拽上传多种格式文件（图片、PDF、Office文档等）
- 🔗 **ServiceNow 集成** - 直接对接 ServiceNow REST API，工单实时同步
- 📋 **工单管理** - 查看工单列表、详情、状态跟踪
- 🎨 **现代化 UI** - 深色主题，科技感设计，响应式布局

## 🚀 快速开始

### 1. 安装依赖

```bash
cd Cursor_Project
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# ServiceNow API 配置
VITE_SERVICENOW_INSTANCE=https://your-instance.service-now.com
VITE_SERVICENOW_USERNAME=your-username
VITE_SERVICENOW_PASSWORD=your-password

# AI 图片分析服务配置 (可选 - 使用 OpenAI Vision API)
VITE_AI_API_KEY=your-openai-api-key
VITE_AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 4. 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
Cursor_Project/
├── public/
│   └── ticket.svg          # 应用图标
├── src/
│   ├── components/         # 组件
│   │   ├── Layout.jsx      # 布局组件
│   │   ├── FileUploader.jsx # 文件上传组件
│   │   └── TicketForm.jsx  # 工单表单组件
│   ├── pages/              # 页面
│   │   ├── HomePage.jsx    # 首页
│   │   ├── CreateTicketPage.jsx # 创建工单页
│   │   ├── TicketListPage.jsx   # 工单列表页
│   │   └── TicketDetailPage.jsx # 工单详情页
│   ├── services/           # 服务层
│   │   ├── servicenowApi.js    # ServiceNow API
│   │   └── aiAnalysisService.js # AI 分析服务
│   ├── styles/
│   │   └── global.css      # 全局样式
│   ├── App.jsx             # 应用入口
│   └── main.jsx            # 主入口
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 ServiceNow API 配置

### 所需权限

确保 ServiceNow 账户具有以下权限：
- `incident_table` 读写权限
- `attachment` API 访问权限

### API 端点

系统使用以下 ServiceNow REST API：

| 功能 | 方法 | 端点 |
|------|------|------|
| 创建工单 | POST | `/api/now/table/incident` |
| 获取工单列表 | GET | `/api/now/table/incident` |
| 获取工单详情 | GET | `/api/now/table/incident/{sys_id}` |
| 上传附件 | POST | `/api/now/attachment/file` |
| 获取附件列表 | GET | `/api/now/attachment` |

## 🤖 AI 分析功能

### 支持的 AI 服务

- **OpenAI Vision API** (GPT-4 Vision) - 推荐
- 可扩展支持其他视觉 AI 服务

### 分析内容

AI 会分析上传的截图并提供：
1. **错误识别** - 准确识别图片中的错误类型和信息
2. **问题分类** - 判断问题类型（软件/硬件/网络等）
3. **可能原因** - 分析导致错误的可能原因
4. **解决建议** - 提供具体的解决步骤
5. **优先级建议** - 根据严重程度建议工单优先级

### 演示模式

如果未配置 AI API Key，系统会自动使用演示模式，返回模拟的分析结果。

## 📝 使用说明

### 创建工单

1. 点击「创建工单」进入提单页面
2. 填写工单标题和详细描述
3. 上传相关截图或附件
4. （可选）点击「AI 分析图片」获取智能建议
5. 确认信息后提交工单

### 查看工单

1. 点击「工单列表」查看所有工单
2. 使用搜索和筛选功能找到目标工单
3. 点击工单查看详细信息

## 🛠️ 技术栈

- **框架**: React 18
- **构建工具**: Vite 5
- **路由**: React Router 6
- **HTTP 客户端**: Axios
- **文件上传**: react-dropzone
- **图标**: Lucide React
- **通知**: react-hot-toast

## 📄 许可证

MIT License
