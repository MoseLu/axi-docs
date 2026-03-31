import { getKnowledgeCategoryLabel } from '../config/knowledgeRules'
import { DocSource, KnowledgeCatalog, KnowledgeCatalogSection, SearchResult, SelectedFile } from '../types'
import { DocumentView } from './DocumentView'
import { BookIcon, FileIcon, GridIcon, LinkIcon } from './Icons'
import { QuickKnowledgeItemLike } from './HomeCommandCenter'

function sourceLabel(sourceId: string): string {
  if (sourceId === 'obsidian') return 'Obsidian'
  if (sourceId === 'blinko') return 'Blinko'
  return sourceId
}

function documentTitle(result: Pick<SearchResult, 'title' | 'name'> | Pick<QuickKnowledgeItemLike, 'title' | 'name'>) {
  return (result.title || result.name).replace(/\.md$/i, '')
}

function summarizeText(value: string | null | undefined, limit = 180) {
  if (!value) return null
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) return null
  return normalized.length > limit ? `${normalized.slice(0, limit)}…` : normalized
}

interface ResultsEvidenceSectionProps {
  source: DocSource
  catalog: KnowledgeCatalog | null
  catalogLoading: boolean
  catalogError: string | null
  searchQuery: string
  searching: boolean
  filteredResults: SearchResult[]
  groupedResults: Array<{
    key: string
    label: string
    meta: { key: string; title: string; description: string }
    items: SearchResult[]
  }>
  resultCategorySummary: Array<{ key: string; count: number }>
  filteredSections: KnowledgeCatalogSection[]
  selectedFile: SelectedFile | null
  fileContent: string | null
  fileName: string
  fileLoading: boolean
  activeCategory: string | null
  setActiveCategory: (category: string | null) => void
  quickOpenItems: QuickKnowledgeItemLike[]
  onOpenItem: (sourceId: string, path: string) => void
  onTagSelect: (tag: string | null) => void
  onSearch: (query: string) => void
  onWikiLink: (noteName: string) => void
  onOpenExplorer: () => void
}

export function ResultsEvidenceSection({
  source,
  catalog,
  catalogLoading,
  catalogError,
  searchQuery,
  searching,
  filteredResults,
  groupedResults,
  resultCategorySummary,
  filteredSections,
  selectedFile,
  fileContent,
  fileName,
  fileLoading,
  activeCategory,
  setActiveCategory,
  quickOpenItems,
  onOpenItem,
  onTagSelect,
  onSearch,
  onWikiLink,
  onOpenExplorer,
}: ResultsEvidenceSectionProps) {
  return (
    <section className="results-evidence">
      <div className="results-evidence__header">
        <div>
          <div className="results-evidence__eyebrow">Answers & Evidence</div>
          <h2>{searchQuery.trim() ? '答案候选与原文证据' : '从经验分层进入证据阅读'}</h2>
          <p>
            {searchQuery.trim()
              ? '先判断命中的经验层，再打开最可靠的原文证据。'
              : '首页第二屏专注于答案候选和证据阅读，不再和图谱舞台争夺主视线。'}
          </p>
        </div>
        <button className="results-evidence__explore" onClick={onOpenExplorer} type="button">
          进入图谱探索
        </button>
      </div>

      <div className="workbench-categorybar workbench-categorybar--command">
        <button
          className={`category-chip${activeCategory === null ? ' active' : ''}`}
          onClick={() => setActiveCategory(null)}
          type="button"
        >
          全部经验
        </button>
        {(catalog?.sections || []).map((section) => (
          <button
            key={section.key}
            className={`category-chip${activeCategory === section.key ? ' active' : ''}`}
            onClick={() => setActiveCategory(activeCategory === section.key ? null : section.key)}
            type="button"
          >
            <span>{section.title}</span>
            <small>{section.count}</small>
          </button>
        ))}
      </div>

      <div className="results-evidence__grid">
        <section className="results-evidence__panel results-evidence__panel--answers">
          <div className="panel-heading">
            <div>
              <div className="panel-eyebrow">Candidate Radar</div>
              <h2>{searchQuery.trim() ? '查询结果与经验分层' : '经验分层总览'}</h2>
              <p>
                {searchQuery.trim()
                  ? '命中结果按照经验层重新归组，方便先做判断再打开证据。'
                  : '从项目、架构、规范、组件和方案层快速判断知识库是否已有成熟沉淀。'}
              </p>
            </div>
            <GridIcon />
          </div>

          {searchQuery.trim() ? (
            <>
              <div className="query-summary-card">
                <div>
                  <span className="query-summary-card__label">检索焦点</span>
                  <strong>{searchQuery}</strong>
                </div>
                <div className="query-summary-card__meta">
                  <span>{searching ? '搜索中...' : `命中 ${filteredResults.length} 条`}</span>
                  {filteredResults[0] && (
                    <button
                      className="query-summary-card__action"
                      onClick={() => onOpenItem(filteredResults[0].sourceId, filteredResults[0].path)}
                      type="button"
                    >
                      打开最佳证据
                    </button>
                  )}
                </div>
              </div>

              {resultCategorySummary.length > 0 && (
                <div className="result-summary-grid">
                  {resultCategorySummary.map((group) => (
                    <button
                      key={group.key}
                      className={`result-summary-card${activeCategory === group.key ? ' active' : ''}`}
                      onClick={() => setActiveCategory(activeCategory === group.key ? null : group.key)}
                      type="button"
                    >
                      <span>{getKnowledgeCategoryLabel(group.key)}</span>
                      <strong>{group.count}</strong>
                    </button>
                  ))}
                </div>
              )}

              {groupedResults.length > 0 ? (
                <div className="result-groups">
                  {groupedResults.map((group) => (
                    <div key={group.key} className="result-group">
                      <div className="result-group__header">
                        <div>
                          <h3>{group.label}</h3>
                          <p>{group.meta.description}</p>
                        </div>
                        <span>{group.items.length}</span>
                      </div>

                      <div className="result-group__list">
                        {group.items.slice(0, 6).map((result) => (
                          <button
                            key={`${result.sourceId}:${result.path}`}
                            className={`experience-card${selectedFile?.path === result.path ? ' active' : ''}`}
                            onClick={() => onOpenItem(result.sourceId, result.path)}
                            type="button"
                          >
                            <div className="experience-card__topline">
                              <span className="experience-card__source">{sourceLabel(result.sourceId)}</span>
                              {result.docType && <span className="experience-card__type">{result.docType}</span>}
                            </div>
                            <strong>{documentTitle(result)}</strong>
                            {summarizeText(result.description, 132) && <p>{summarizeText(result.description, 132)}</p>}
                            {summarizeText(result.snippet, 180) && (
                              <div className="experience-card__snippet">{summarizeText(result.snippet, 180)}</div>
                            )}
                            <div className="experience-card__meta">
                              <span>{result.path}</span>
                              {result.matchedBy?.length ? <span>命中 {result.matchedBy.join(' / ')}</span> : null}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="workbench-empty">
                  <BookIcon />
                  <div>
                    <strong>还没有命中结果</strong>
                    <p>换一个关键词，或者从经验分层直接进入已有沉淀。</p>
                  </div>
                </div>
              )}
            </>
          ) : catalogLoading ? (
            <div className="workbench-empty">
              <div className="spinner" />
              <div>
                <strong>正在整理知识库</strong>
                <p>读取分类索引、标签和最近沉淀的经验。</p>
              </div>
            </div>
          ) : catalogError ? (
            <div className="workbench-empty">
              <BookIcon />
              <div>
                <strong>知识目录加载失败</strong>
                <p>{catalogError}</p>
              </div>
            </div>
          ) : (
            <div className="section-board">
              {filteredSections.map((section) => (
                <article key={section.key} className="section-lane">
                  <div className="section-lane__header">
                    <div>
                      <h3>{section.title}</h3>
                      <p>{section.description}</p>
                    </div>
                    <span>{section.count}</span>
                  </div>

                  <div className="section-lane__items">
                    {section.items.slice(0, 6).map((item) => (
                      <button
                        key={`${item.sourceId}:${item.path}`}
                        className={`section-doc${selectedFile?.path === item.path ? ' active' : ''}`}
                        onClick={() => onOpenItem(item.sourceId, item.path)}
                        type="button"
                      >
                        <div className="section-doc__title">{item.title}</div>
                        <div className="section-doc__desc">{summarizeText(item.description, 140) || item.path}</div>
                        <div className="section-doc__footer">
                          <span>{item.path}</span>
                          {item.updated && <span>{new Date(item.updated).toLocaleDateString('zh-CN')}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="results-evidence__panel results-evidence__panel--evidence">
          <div className="panel-heading">
            <div>
              <div className="panel-eyebrow">Evidence Dock</div>
              <h2>{selectedFile ? '原文证据' : '待选证据'}</h2>
              <p>
                {selectedFile
                  ? '保持原文证据、frontmatter 与双向链接在同一阅读区，减少来回跳转。'
                  : '打开任意答案候选后，这里会变成证据阅读区；没有选中时展示最近入口。'}
              </p>
            </div>
            <LinkIcon />
          </div>

          <div className="evidence-shell evidence-shell--command">
            {selectedFile ? (
              <DocumentView
                content={fileContent}
                fileName={fileName}
                loading={fileLoading}
                onTagSelect={(tag) => onTagSelect(tag)}
                onWikiLink={onWikiLink}
                selectedFile={selectedFile}
                showKnowledgePanel={false}
                source={source}
                variant="panel"
              />
            ) : (
              <div className="evidence-empty">
                <div className="evidence-empty__intro">
                  <FileIcon />
                  <div>
                    <strong>还没有锁定证据</strong>
                    <p>从左侧答案候选中打开一份文档，这里就会进入证据阅读模式。</p>
                  </div>
                </div>

                <div className="evidence-suggestions">
                  <div className="evidence-suggestions__header">
                    <span>快速入口</span>
                    <small>{quickOpenItems.length} 条</small>
                  </div>
                  <div className="evidence-suggestions__list">
                    {quickOpenItems.map((item) => (
                      <button
                        key={`${item.sourceId}:${item.path}`}
                        className="evidence-suggestion"
                        onClick={() => onOpenItem(item.sourceId, item.path)}
                        type="button"
                      >
                        <div>
                          <strong>{documentTitle(item)}</strong>
                          {'description' in item && summarizeText(item.description, 120) && <p>{summarizeText(item.description, 120)}</p>}
                        </div>
                        <span>{item.path}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="agent-brief">
                  <div className="agent-brief__header">
                    <LinkIcon />
                    <span>推荐检索路径</span>
                  </div>
                  <ul>
                    <li>先搜 “组件库 / 主题 token / 响应式布局” 判断是否已有前端经验。</li>
                    <li>再搜 “ADR / architecture / 设计依据” 锁定历史决策。</li>
                    <li>最后用“图谱探索”把当前证据放回全局上下文中看关系。</li>
                  </ul>
                  <div className="agent-brief__actions">
                    <button onClick={() => onSearch('组件库 主题 token 响应式布局')} type="button">
                      搜首页改版经验
                    </button>
                    <button onClick={onOpenExplorer} type="button">
                      打开图谱探索
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  )
}
