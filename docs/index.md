---
title: 星际文档系统
head:
  - - meta
    - name: description
      content: 星际文档系统 - 基于 VitePress 构建的现代化文档管理平台，专为团队协作和知识管理而设计
---

<div class="hero">
  <div class="hero-content">
    <h1 class="hero-title">
      星际文档系统
      <span class="hero-subtitle">现代化文档管理平台</span>
    </h1>
    <p class="hero-description">
      基于 VitePress 构建的专业文档系统，融合数学严谨逻辑与科技创新精神，
      为团队提供高效的知识管理和协作解决方案。
    </p>
         <div class="hero-actions">
       <a class="action-button primary" href="/docs/content/quick-start.html">
         快速开始
       </a>
       <a class="action-button secondary" href="/docs/content/流程控制.html">
         系统架构
       </a>
     </div>
  </div>
     <div class="hero-image">
     <img src="/index.png" alt="星际文档系统 Logo" class="logo-image">
   </div>
</div>

<div class="features">
  <div class="feature">
    <div class="feature-icon">📚</div>
    <h3>智能文档管理</h3>
    <p>支持 Markdown 格式，自动生成目录结构，提供智能搜索和分类管理功能。</p>
  </div>
  <div class="feature">
    <div class="feature-icon">🔄</div>
    <h3>流程控制系统</h3>
    <p>先进的流程控制架构，实现生产、采购、品质、仓库等部门的高效协同。</p>
  </div>
  <div class="feature">
    <div class="feature-icon">🎨</div>
    <h3>品牌设计理念</h3>
    <p>融合数学严谨逻辑与科技创新精神，从公理到应用的核心理念。</p>
  </div>
  <div class="feature">
    <div class="feature-icon">🛠️</div>
    <h3>开发工具支持</h3>
    <p>提供完整的开发工具链，支持热重载、TypeScript、自动构建部署。</p>
  </div>
</div>

<div class="content-sections">
  <div class="section">
    <h2>📖 文档分类</h2>
    <div class="category-grid">
             <div class="category-card">
         <h3>📋 指南</h3>
         <p>系统使用指南和快速入门</p>
         <ul>
           <li><a href="/docs/content/quick-start.html">快速开始</a></li>
         </ul>
       </div>
       <div class="category-card">
         <h3>🏗️ 系统架构</h3>
         <p>系统架构设计和流程控制</p>
         <ul>
           <li><a href="/docs/content/流程控制.html">流程控制系统</a></li>
         </ul>
       </div>
       <div class="category-card">
         <h3>🎨 品牌设计</h3>
         <p>品牌理念和设计规范</p>
         <ul>
           <li><a href="/docs/content/Logo具体含义.html">Logo设计理念与含义</a></li>
         </ul>
       </div>
       <div class="category-card">
         <h3>🛠️ 工具文档</h3>
         <p>开发工具和技术文档</p>
         <ul>
           <li><a href="/docs/content/如何判断用户离开当前页.html">如何判断用户离开当前页</a></li>
         </ul>
       </div>
    </div>
  </div>

  <div class="section">
    <h2>🚀 核心功能</h2>
    <div class="feature-details">
      <div class="feature-detail">
        <h3>智能流程管理</h3>
        <p>采用先进的流程控制架构，通过智能化的流程管理，实现各部门的高效协同。支持常规流程、问题追踪流程和产品追踪流程等多种类型。</p>
      </div>
      <div class="feature-detail">
        <h3>数据驱动决策</h3>
        <p>基于实时数据分析，提供智能决策支持。通过主流程控制任务，实现生产、采购、品质、仓库等部门的自动化管理。</p>
      </div>
      <div class="feature-detail">
        <h3>现代化文档系统</h3>
        <p>基于 VitePress 构建，支持 Markdown 格式，提供智能搜索、深色模式、响应式设计等现代化功能。</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>🎯 设计理念</h2>
    <div class="philosophy">
      <div class="philosophy-item">
        <h3>公理体系可视化</h3>
        <p>Logo 设计融合了数学的严谨逻辑与科技的创新精神，通过精心设计的视觉元素，传达出"从基础到复杂、从确定到可能"的核心理念。</p>
      </div>
      <div class="philosophy-item">
        <h3>简单规则生成复杂系统</h3>
        <p>从整体看，Logo 的"块面叠合、线条互联"直观呈现了"简单规则生成复杂系统"的逻辑，这正是数学和科技的共通精神。</p>
      </div>
    </div>
  </div>
</div>

<div class="cta-section">
  <h2>开始使用星际文档系统</h2>
  <p>立即体验现代化的文档管理平台，提升团队协作效率</p>
     <div class="cta-actions">
     <a class="action-button primary" href="/docs/content/quick-start.html">开始使用</a>
     <a class="action-button secondary" href="/docs/content/流程控制.html">了解架构</a>
   </div>
</div>

<style>
.hero {
  display: flex;
  align-items: center;
  padding: 4rem 0;
  gap: 2rem;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
}

/* 暗色主题保持渐变效果 */
.starry-theme .hero-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 亮色主题使用浅蓝色 */
.cloud-theme .hero-title {
  color: #35a3f7;
  text-shadow: 
    -1px -1px 0 rgba(255, 255, 255, 0.9),
    1px -1px 0 rgba(255, 255, 255, 0.9),
    -1px 1px 0 rgba(255, 255, 255, 0.9),
    1px 1px 0 rgba(255, 255, 255, 0.9),
    0 0 8px rgba(53, 163, 247, 0.4);
  border-bottom: 2px solid rgba(255, 255, 255, 0.8);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.3);
}

.hero-subtitle {
  display: block;
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--vp-c-text-2);
  margin-top: 0.5rem;
}

.hero-description {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin: 1.5rem 0;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-button.secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

 .logo-image {
   width: 250px;
   height: auto;
   border-radius: 8px;
 }

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
}

.feature {
  text-align: center;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.feature p {
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

.content-sections {
  margin: 4rem 0;
}

.section {
  margin: 3rem 0;
}

.section h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--vp-c-text-1);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.category-card {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.category-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
}

.category-card p {
  color: var(--vp-c-text-2);
  margin: 0 0 1rem 0;
}

.category-card ul {
  margin: 0;
  padding-left: 1.2rem;
}

.category-card li {
  margin: 0.5rem 0;
}

.category-card a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.category-card a:hover {
  text-decoration: underline;
}

.feature-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-detail {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.feature-detail h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.feature-detail p {
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

.philosophy {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.philosophy-item {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.philosophy-item h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.philosophy-item p {
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}

.cta-section {
  text-align: center;
  padding: 4rem 0;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  margin: 4rem 0;
}

.cta-section h2 {
  font-size: 2rem;
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
}

.cta-section p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0 0 2rem 0;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .philosophy {
    grid-template-columns: 1fr;
  }
}

/* 首页原生组件中的标题边框 - 天蓝色 */
.cloud-theme .feature h1,
.cloud-theme .feature h2,
.cloud-theme .feature h3,
.cloud-theme .feature h4,
.cloud-theme .feature h5,
.cloud-theme .feature h6,
.cloud-theme .category-card h1,
.cloud-theme .category-card h2,
.cloud-theme .category-card h3,
.cloud-theme .category-card h4,
.cloud-theme .category-card h5,
.cloud-theme .category-card h6,
.cloud-theme .feature-detail h1,
.cloud-theme .feature-detail h2,
.cloud-theme .feature-detail h3,
.cloud-theme .feature-detail h4,
.cloud-theme .feature-detail h5,
.cloud-theme .feature-detail h6,
.cloud-theme .philosophy-item h1,
.cloud-theme .philosophy-item h2,
.cloud-theme .philosophy-item h3,
.cloud-theme .philosophy-item h4,
.cloud-theme .philosophy-item h5,
.cloud-theme .philosophy-item h6,
.cloud-theme .cta-section h1,
.cloud-theme .cta-section h2,
.cloud-theme .cta-section h3,
.cloud-theme .cta-section h4,
.cloud-theme .cta-section h5,
.cloud-theme .cta-section h6 {
  border-bottom: 2px solid rgba(79, 195, 247, 0.6) !important;
  box-shadow: 0 2px 4px rgba(79, 195, 247, 0.3) !important;
}
</style> 