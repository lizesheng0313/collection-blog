<template>
  <div class="project-detail">
    <div v-if="loading" class="loading-container">
      <a-spin size="large" />
    </div>

    <div v-else-if="project" class="max-w-7xl mx-auto p-6 flex gap-8">
      <!-- 主要内容区域 -->
      <div class="flex-1">
        <!-- 项目头部信息 -->
      <div class="project-header bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-4">{{ project.github_full_name }}</h1>
            <p class="text-lg mb-4 opacity-90">{{ project.translated_description || project.original_description }}</p>

            <div class="flex flex-wrap gap-4 mb-4">
              <div class="flex items-center gap-2">
                <span class="text-yellow-300">⭐</span>
                <span>{{ formatNumber(project.stars_count || 0) }} Stars</span>
              </div>
              <div class="flex items-center gap-2">
                <span>🍴</span>
                <span>{{ formatNumber(project.forks_count || 0) }} Forks</span>
              </div>
              <div class="flex items-center gap-2" v-if="project.overall_score">
                <span>📊</span>
                <span>{{ project.overall_score }}/10 分</span>
              </div>
            </div>

            <!-- 技术标签 -->
            <div v-if="project.topics && project.topics.length > 0" class="mb-4">
              <div class="flex flex-wrap gap-2">
                <span v-for="topic in (Array.isArray(project.topics) ? project.topics : project.topics.split(','))" :key="topic"
                      class="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  {{ Array.isArray(project.topics) ? topic : topic.trim() }}
                </span>
              </div>
            </div>

            <div class="flex gap-4">
              <div @click="openGithub"
                   class="text-yellow-400 font-medium hover:text-yellow-300 transition-colors cursor-pointer inline-block">
                查看源码
              </div>
              <div v-if="project.homepage"
                   @click="openHomepage"
                   class="text-yellow-400 font-medium hover:text-yellow-300 transition-colors cursor-pointer inline-block">
                项目主页
              </div>
            </div>
          </div>


        </div>
      </div>

      <!-- 项目介绍 -->
      <div v-if="project.project_intro" class="mb-8" id="project-intro">
        <h3 class="text-lg font-semibold mb-4">📖 项目介绍</h3>
        <div class="bg-white rounded-lg shadow-md p-6">
          <!-- 项目主图 -->
          <div v-if="project.main_image" class="mb-6 text-center">
            <img
              :src="project.main_image"
              :alt="project.github_full_name"
              class="max-w-xs mx-auto rounded-lg shadow-sm"
              @error="handleImageError"
            />
          </div>

          <div class="prose max-w-none markdown-content" v-html="formatMarkdown(project.project_intro)"></div>
        </div>
      </div>



      <!-- 商业分析 -->
      <div v-if="project.business_analysis" class="mb-8" id="business-analysis">
        <h3 class="text-lg font-semibold mb-4">💰 商业分析</h3>
        <div class="bg-white rounded-lg shadow-md p-6">

          <!-- 解决的问题 -->
          <div v-if="businessAnalysis?.problem_solved" class="mb-6" id="business-problem">
            <h4 class="font-medium mb-2 text-blue-600">🎯 解决什么问题？</h4>
            <p class="text-gray-700">{{ businessAnalysis.problem_solved }}</p>
          </div>

          <!-- 目标客户 -->
          <div v-if="businessAnalysis?.target_customers" class="mb-6" id="business-customers">
            <h4 class="font-medium mb-2 text-green-600">👥 谁会买单？</h4>
            <p class="text-gray-700">{{ businessAnalysis.target_customers }}</p>
          </div>

          <!-- 赚钱方法 -->
          <div v-if="businessAnalysis?.money_making_ideas" class="mb-6" id="business-ideas">
            <h4 class="font-medium mb-3 text-purple-600">💡 赚钱方法</h4>
            <div class="space-y-4">
              <div v-for="(idea, index) in businessAnalysis.money_making_ideas" :key="index"
                   class="border rounded-lg p-4 bg-gray-50">
                <div class="flex items-center justify-between mb-2">
                  <h5 class="font-medium">{{ idea.method }}</h5>
                  <span class="text-sm px-2 py-1 rounded"
                        :class="getDifficultyClass(idea.difficulty)">
                    {{ idea.difficulty }}
                  </span>
                </div>
                <p class="text-gray-600 text-sm mb-2">{{ idea.description }}</p>
                <p class="text-blue-600 font-medium text-sm">💰 {{ idea.price_range }}</p>
              </div>
            </div>
          </div>

          <!-- 销售渠道 -->
          <div v-if="businessAnalysis?.sales_channels" class="mb-6" id="business-channels">
            <h4 class="font-medium mb-2 text-orange-600">🛒 在哪里卖？</h4>
            <p class="text-gray-700">{{ businessAnalysis.sales_channels }}</p>
          </div>

          <!-- 推广建议 -->
          <div v-if="businessAnalysis?.marketing_tips" class="mb-6" id="business-marketing">
            <h4 class="font-medium mb-2 text-pink-600">📢 怎么推广？</h4>
            <p class="text-gray-700">{{ businessAnalysis.marketing_tips }}</p>
          </div>

          <!-- 启动成本 -->
          <div v-if="businessAnalysis?.startup_cost" class="mb-6" id="business-cost">
            <h4 class="font-medium mb-2 text-yellow-600">💸 启动成本</h4>
            <p class="text-gray-700">{{ businessAnalysis.startup_cost }}</p>
          </div>

          <!-- 风险提醒 -->
          <div v-if="businessAnalysis?.risks" class="mb-6" id="business-risks">
            <h4 class="font-medium mb-2 text-red-600">⚠️ 风险提醒</h4>
            <p class="text-gray-700">{{ businessAnalysis.risks }}</p>
          </div>

          <!-- 快速开始 -->
          <div v-if="businessAnalysis?.quick_start" class="mb-6" id="business-start">
            <h4 class="font-medium mb-2 text-indigo-600">🚀 马上行动</h4>
            <p class="text-gray-700">{{ businessAnalysis.quick_start }}</p>
          </div>

          <!-- 收益预估 -->
          <div v-if="businessAnalysis?.profit_potential" class="p-4 bg-green-50 rounded-lg" id="business-profit">
            <h4 class="font-medium mb-2 text-green-700">📈 收益预估</h4>
            <p class="text-green-700 font-medium">{{ businessAnalysis.profit_potential }}</p>
          </div>

        </div>
      </div>

      <!-- 评论区域 -->
      <div class="mb-8" id="comments">
        <h3 class="text-lg font-semibold mb-4">💬 评论讨论</h3>
        <CommentSection
          :article-id="project?.id"
          article-type="github_project"
          v-if="project?.id"
        />
      </div>
      </div>

      <!-- 右侧文档目录 -->
      <div class="w-64 hidden lg:block">
        <div class="sticky top-6">
          <div class="bg-white rounded-lg shadow-md p-4">
            <h4 class="font-semibold mb-4 text-gray-800">文档目录</h4>
            <nav class="space-y-2">
              <!-- 项目介绍 -->
              <div v-if="project.project_intro">
                <a href="#project-intro" class="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-1">
                  📖 项目介绍
                </a>
                <div class="ml-4 space-y-1" v-for="section in projectIntroSections" :key="section.id">
                  <a :href="`#${section.id}`" class="block text-xs text-gray-500 hover:text-blue-500 transition-colors py-0.5">
                    {{ section.title }}
                  </a>
                </div>
              </div>

              <!-- 商业分析 -->
              <div v-if="project.business_analysis">
                <a href="#business-analysis" class="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-1">
                  💰 商业分析
                </a>
                <div class="ml-4 space-y-1" v-for="section in businessAnalysisSections" :key="section.key">
                  <a :href="`#business-${section.key}`" class="block text-xs text-gray-500 hover:text-blue-500 transition-colors py-0.5">
                    {{ section.title }}
                  </a>
                </div>
              </div>

              <!-- 评论区 -->
              <div>
                <a href="#comments" class="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-1">
                  💬 评论讨论
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="text-center py-12">
      <div class="text-gray-500">项目不存在或已被删除</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getGitHubProjectDetail } from '@/api/github'
import CommentSection from '@/components/CommentSection.vue'

const route = useRoute()
const loading = ref(false)
const project = ref(null)

// 解析商业价值分析数据
const businessAnalysis = computed(() => {
  if (!project.value?.business_analysis) return null
  try {
    const analysis = typeof project.value.business_analysis === 'string'
      ? JSON.parse(project.value.business_analysis)
      : project.value.business_analysis

    // 如果有raw_ai_response，尝试解析它
    if (analysis.raw_ai_response) {
      try {
        // 提取JSON部分，处理转义字符
        let rawResponse = analysis.raw_ai_response
        // 处理转义的引号
        rawResponse = rawResponse.replace(/\\"/g, '"')
        rawResponse = rawResponse.replace(/\\n/g, '\n')

        const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/)
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[1])
          return parsedData
        }
      } catch (e) {
        console.warn('Failed to parse raw_ai_response:', e)
      }
    }

    return analysis
  } catch (error) {
    console.error('Failed to parse business analysis:', error)
    return null
  }
})

// 解析项目介绍的章节
const projectIntroSections = computed(() => {
  if (!project.value?.project_intro) return []

  const sections = []
  const lines = project.value.project_intro.split('\n')

  lines.forEach(line => {
    const match = line.match(/^## (\d+)\.\s*(.+)/)
    if (match) {
      sections.push({
        id: `section-${match[1]}`,
        title: `${match[1]}. ${match[2]}`
      })
    }
  })

  return sections
})

// 解析商业分析的章节
const businessAnalysisSections = computed(() => {
  if (!businessAnalysis.value) return []

  const sections = [
    { key: 'problem', title: '🎯 解决什么问题？' },
    { key: 'customers', title: '👥 谁会买单？' },
    { key: 'ideas', title: '💡 赚钱方法' },
    { key: 'channels', title: '🛒 在哪里卖？' },
    { key: 'marketing', title: '📢 怎么推广？' },
    { key: 'cost', title: '💸 启动成本' },
    { key: 'risks', title: '⚠️ 风险提醒' },
    { key: 'start', title: '🚀 马上行动' },
    { key: 'profit', title: '📈 收益预估' }
  ]

  // 只返回有数据的章节
  return sections.filter(section => {
    const key = section.key === 'problem' ? 'problem_solved' :
                section.key === 'customers' ? 'target_customers' :
                section.key === 'ideas' ? 'money_making_ideas' :
                section.key === 'channels' ? 'sales_channels' :
                section.key === 'marketing' ? 'marketing_tips' :
                section.key === 'cost' ? 'startup_cost' :
                section.key === 'risks' ? 'risks' :
                section.key === 'start' ? 'quick_start' :
                section.key === 'profit' ? 'profit_potential' : null

    return key && businessAnalysis.value[key]
  })
})

// 获取项目详情
const fetchProjectDetail = async () => {
  const { owner, repo } = route.params

  try {
    loading.value = true
    const response = await getGitHubProjectDetail(owner, repo)

    if (response.success) {
      project.value = response.data
      // 更新页面标题
      updatePageTitle()
    }
  } catch (error) {
    console.error('获取项目详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 打开GitHub链接
const openGithub = () => {
  if (project.value?.github_url) {
    window.open(project.value.github_url, '_blank')
  }
}

// 打开项目主页
const openHomepage = () => {
  if (project.value?.homepage) {
    window.open(project.value.homepage, '_blank')
  }
}



// 获取难度等级样式
const getDifficultyClass = (difficulty) => {
  const classes = {
    '简单': 'bg-green-100 text-green-800',
    '中等': 'bg-yellow-100 text-yellow-800',
    '困难': 'bg-red-100 text-red-800'
  }
  return classes[difficulty] || 'bg-gray-100 text-gray-800'
}

const formatMarkdown = (text) => {
  if (!text) return ''

  // 简单的markdown转换
  return text
    // 先处理粗体（在任何位置）
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 处理标题并添加ID锚点
    .replace(/^## (\d+)\.\s*(.*$)/gim, (match, num, title) => {
      const marginTop = num === '1' ? '0.5rem' : '1.25rem'
      return `<h2 id="section-${num}" class="text-xl font-bold mb-6" style="margin-top: ${marginTop}; margin-bottom: 0.5rem;">${num}. ${title}</h2>`
    })
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    // 处理列表
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
    .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
    // 处理代码块
    .replace(/```bash\n([\s\S]*?)\n```/g, '<pre class="bg-gray-100 p-3 rounded mt-2 mb-2 overflow-x-auto"><code>$1</code></pre>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded mt-2 mb-2 overflow-x-auto"><code>$1</code></pre>')
    // 处理段落
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^(.*)$/gim, '<p class="mb-3">$1</p>')
    // 清理标题和列表的段落包装
    .replace(/<p class="mb-3"><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
    .replace(/<p class="mb-3"><li/g, '<li')
    .replace(/<\/li><\/p>/g, '</li>')
    .replace(/<p class="mb-3"><pre/g, '<pre')
    .replace(/<\/pre><\/p>/g, '</pre>')
}

const handleImageError = (event) => {
  // 图片加载失败时隐藏图片，显示默认图标
  event.target.style.display = 'none'
}

onMounted(() => {
  fetchProjectDetail()
})

// 监听项目数据变化，更新页面标题
const updatePageTitle = () => {
  if (project.value) {
    const projectName = project.value.github_info?.full_name || project.value.github_full_name || '项目详情'
    document.title = `${projectName} - 肥猫猫GitHub项目精选`

    // 更新页面描述
    const description = project.value.github_info?.translated_description ||
                       project.value.translated_description ||
                       project.value.github_info?.original_description ||
                       project.value.original_description ||
                       '优质开源项目详情介绍'

    // 更新meta描述
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }
  }
}

// updatePageTitle 函数已经在 fetchProjectDetail 中调用了
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.prose {
  line-height: 1.7;
}

.prose h1, .prose h2, .prose h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.prose h2 {
  font-size: 1.25rem;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.prose strong {
  font-weight: 600;
  color: #1f2937;
}

.prose p {
  margin-bottom: 1.5em;
  line-height: 1.7;
}

.prose ul, .prose ol {
  margin-bottom: 2em;
  padding-left: 1.5em;
}

.prose li {
  margin-bottom: 0.5em;
  line-height: 1.6;
}

.prose code {
  background: #f1f5f9;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

/* 确保项目头部文字都是白色 */
.project-header h1,
.project-header p,
.project-header span {
  color: white !important;
}
</style>