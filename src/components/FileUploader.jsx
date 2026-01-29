import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  Image, 
  FileText, 
  X, 
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import AIAnalysisService from '../services/aiAnalysisService'

const FileUploader = ({ 
  files, 
  setFiles, 
  onAIAnalysis,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : null,
      id: `${file.name}-${Date.now()}`
    }))
    
    setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles))
  }, [setFiles, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.log', '.csv'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  })

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image size={20} className="file-icon image" />
    }
    return <FileText size={20} className="file-icon document" />
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // AI 分析图片
  const handleAIAnalysis = async () => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      return
    }

    setAnalyzing(true)
    setAnalysisResult(null)

    try {
      const result = await AIAnalysisService.analyzeError(imageFiles)
      setAnalysisResult(result)
      
      if (result.success && onAIAnalysis) {
        onAIAnalysis(result)
      }
    } catch (error) {
      setAnalysisResult({
        success: false,
        error: error.message
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const hasImages = files.some(f => f.type.startsWith('image/'))

  return (
    <div className="file-uploader">
      {/* 拖拽上传区域 */}
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <Upload size={40} className="upload-icon" />
          <p className="dropzone-text">
            {isDragActive 
              ? '释放文件以上传' 
              : '拖拽文件到此处，或点击选择文件'
            }
          </p>
          <p className="dropzone-hint">
            支持图片、PDF、Word、Excel等格式，单个文件最大 10MB
          </p>
        </div>
      </div>

      {/* 已上传文件列表 */}
      {files.length > 0 && (
        <div className="uploaded-files">
          <div className="files-header">
            <h4>已上传 ({files.length}/{maxFiles})</h4>
            {hasImages && (
              <button 
                type="button"
                className="ai-analyze-btn"
                onClick={handleAIAnalysis}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 size={16} className="spinning" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    AI 分析图片
                  </>
                )}
              </button>
            )}
          </div>

          <div className="files-grid">
            {files.map(file => (
              <div key={file.id} className="file-item">
                {file.preview ? (
                  <div className="file-preview">
                    <img src={file.preview} alt={file.name} />
                  </div>
                ) : (
                  <div className="file-preview placeholder">
                    {getFileIcon(file)}
                  </div>
                )}
                <div className="file-info">
                  <span className="file-name" title={file.name}>
                    {file.name}
                  </span>
                  <span className="file-size">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <button 
                  type="button"
                  className="remove-btn"
                  onClick={() => removeFile(file.id)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI 分析结果 */}
      {analysisResult && (
        <div className={`analysis-result ${analysisResult.success ? 'success' : 'error'}`}>
          <div className="analysis-header">
            {analysisResult.success ? (
              <>
                <CheckCircle size={20} />
                <span>AI 分析完成</span>
                {analysisResult.isMock && (
                  <span className="mock-badge">演示模式</span>
                )}
              </>
            ) : (
              <>
                <AlertCircle size={20} />
                <span>分析失败</span>
              </>
            )}
          </div>
          
          {analysisResult.success ? (
            <div className="analysis-content">
              <div 
                className="analysis-text"
                dangerouslySetInnerHTML={{ 
                  __html: analysisResult.analysis.fullText
                    .replace(/\n/g, '<br>')
                    .replace(/##\s*(.*?)(?=<br>|$)/g, '<h3>$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }}
              />
              <div className="analysis-suggestions">
                <span className="suggestion-item">
                  建议优先级: 
                  <strong>
                    {analysisResult.analysis.suggestedPriority === '1' ? '高' :
                     analysisResult.analysis.suggestedPriority === '2' ? '中' : '低'}
                  </strong>
                </span>
                <span className="suggestion-item">
                  建议分类: 
                  <strong>
                    {{
                      software: '软件问题',
                      hardware: '硬件问题',
                      network: '网络问题',
                      database: '数据库问题',
                      security: '安全问题',
                      other: '其他'
                    }[analysisResult.analysis.suggestedCategory] || '其他'}
                  </strong>
                </span>
              </div>
            </div>
          ) : (
            <p className="error-message">{analysisResult.error}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUploader

