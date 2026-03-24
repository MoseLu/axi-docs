import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { DocumentView } from './components/DocumentView'
import { Header } from './components/Header'
import { DocSource } from './types'

const API_BASE = '/docs/api'

function HomePage() {
  const [sources, setSources] = useState<DocSource[]>([])
  const [selectedFile, setSelectedFile] = useState<{ sourceId: string; path: string } | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSources()
  }, [])

  useEffect(() => {
    if (selectedFile) {
      loadFile(selectedFile.sourceId, selectedFile.path)
    }
  }, [selectedFile])

  const fetchSources = async () => {
    try {
      const response = await fetch(`${API_BASE}/sources`)
      if (response.ok) {
        const data = await response.json()
        setSources(data)
      }
    } catch (error) {
      console.error('Failed to fetch sources:', error)
    }
  }

  const loadFile = async (sourceId: string, path: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${API_BASE}/file?source=${sourceId}&path=${encodeURIComponent(path)}`
      )
      if (response.ok) {
        const content = await response.text()
        setFileContent(content)
        setFileName(path.split('/').pop() || 'Untitled')
      } else {
        setFileContent('# 文件加载失败\n\n无法加载该文件内容。')
        setFileName(path.split('/').pop() || 'Error')
      }
    } catch (error) {
      setFileContent('# 加载错误\n\n网络请求失败。')
      setFileName('Error')
    }
    setLoading(false)
  }

  const handleFileSelect = (sourceId: string, path: string) => {
    setSelectedFile({ sourceId, path })
  }

  const handleRefresh = () => {
    setRefreshKey(k => k + 1)
    if (selectedFile) {
      loadFile(selectedFile.sourceId, selectedFile.path)
    }
  }

  return (
    <div className="app-layout">
      <Header onRefresh={handleRefresh} />
      <main className="app-main">
        <Sidebar
          sources={sources}
          onFileSelect={handleFileSelect}
          refreshKey={refreshKey}
          selectedFile={selectedFile}
        />
        <DocumentView
          content={fileContent}
          fileName={fileName}
          loading={loading}
          selectedFile={selectedFile}
        />
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  )
}

export default App
