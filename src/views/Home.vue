<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- 头部区域 -->
    <div class="bg-white shadow-sm border-b border-gray-100">
      <div class="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div class="text-center">
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">开源探索</h1>
              <p class="text-gray-600 mt-2">发现优质开源项目，探索技术前沿</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <div class="text-gray-600 text-lg">正在加载精选项目...</div>
        </div>
      </div>

      <!-- 筛选条件 -->
      <div v-if="!loading" class="mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <h2 class="text-lg font-semibold text-gray-800">热门趋势</h2>
              <a-radio-group v-model:value="filters.trending_period" @change="fetchData" size="large" class="bg-gray-50 rounded-lg p-1">
                <a-radio-button value="daily" class="px-6 py-2">今日热门</a-radio-button>
                <a-radio-button value="weekly" class="px-6 py-2">本周精选</a-radio-button>
                <a-radio-button value="monthly" class="px-6 py-2">月度推荐</a-radio-button>
              </a-radio-group>
            </div>
            <div class="text-sm text-gray-500">
              共找到 {{ posts.length }} 个优质项目
            </div>
          </div>
        </div>
      </div>

      <!-- 数据为空状态 -->
      <div v-if="!loading && posts.length === 0" class="text-center py-20">
        <div class="max-w-md mx-auto">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">暂无项目数据</h3>
          <p class="text-gray-600">当前时间段内没有找到相关项目，请尝试切换其他时间段</p>
        </div>
      </div>

      <!-- 主体内容 -->
      <div v-if="!loading && posts.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="post in posts" :key="post.id" class="group">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group-hover:border-blue-300 cursor-pointer" @click="goToDetail(post)">
          <div class="relative h-48 flex items-center justify-center" :style="getCardBackground(post)">
            <!-- GitHub项目显示GitHub图标 -->
            <template v-if="post.article_type === 'github_project'">
              <div class="text-6xl text-white opacity-80">
                <svg viewBox="0 0 24 24" class="w-16 h-16 fill-current">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
            </template>
            <!-- 普通文章显示图片或图标 -->
            <template v-else>
              <template v-if="post.cover">
                <img :src="post.cover" alt="cover" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                <component :is="iconComponents[post.coverIcon || 'file-text']" class="text-7xl text-white opacity-80" />
              </template>
            </template>

            <div class="absolute top-2 left-2">
              <Tag :color="getTagColor(post)" class="border-0">
                {{ getTagLabel(post) }}
              </Tag>
            </div>

            <!-- GitHub项目显示评分 -->
            <div v-if="post.article_type === 'github_project' && post.overall_score" class="absolute top-2 right-2">
              <Tag color="#f39c12" class="border-0">
                {{ post.overall_score }}/10
              </Tag>
            </div>
          </div>

          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ post.github_full_name || post.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{{ post.translated_description || post.original_description || post.content }}</p>

            <!-- 统计信息 -->
            <div class="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-4 text-sm">
                <span class="flex items-center text-yellow-600">
                  <StarOutlined class="mr-1" />
                  <span class="font-medium">{{ formatNumber(post.stars_count || 0) }}</span>
                </span>
                <span class="flex items-center text-blue-600">
                  <ForkOutlined class="mr-1" />
                  <span class="font-medium">{{ formatNumber(post.forks_count || 0) }}</span>
                </span>
              </div>
              <button class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105">
                探索项目
              </button>
            </div>

            <!-- 技术标签 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <Tag v-for="tag in getTopics(post).slice(0, 3)" :key="tag"
                   class="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200 rounded-full">
                {{ tag }}
              </Tag>
            </div>

            <!-- 底部信息 -->
            <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <span class="flex items-center">
                <ClockCircleOutlined class="mr-1" />
                {{ formatTime(post.createTime || post.created_at) }}
              </span>
              <span class="flex items-center">
                <EyeOutlined class="mr-1" />
                {{ post.views || 0 }} 次查看
              </span>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Tag } from 'ant-design-vue';
import {
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  Html5Outlined,
  ApiOutlined,
  CodeOutlined,
  NodeIndexOutlined,
  DeploymentUnitOutlined,
  BlockOutlined,
  BoxPlotOutlined,
  LayoutOutlined,
  CloudServerOutlined,
  ContainerOutlined,
  StarOutlined,
  ForkOutlined
} from '@ant-design/icons-vue';
import { getGitHubProjects } from '../api/github.js';

const iconComponents = {
  'file-text': FileTextOutlined,
  'html5': Html5Outlined,
  'api': ApiOutlined,
  'code': CodeOutlined,
  'node': NodeIndexOutlined,
  'react': BlockOutlined,
  'deployment-unit': DeploymentUnitOutlined,
  'block': BlockOutlined,
  'box-plot': BoxPlotOutlined,
  'layout': LayoutOutlined,
  'cloud-server': CloudServerOutlined,
  'container': ContainerOutlined,
  'typescript': CodeOutlined // 没有TypeScript专用图标，用代码图标替代
};

const router = useRouter();
const posts = ref([]);
const loading = ref(false);
const filters = ref({ trending_period: 'daily' });

// 获取GitHub项目数据
const fetchData = async () => {
  try {
    const prev = posts.value;
    loading.value = true;

    // 获取GitHub项目（带周期筛选）
    const params = { page: 1, pageSize: 20 };
    if (filters.value.trending_period) params.trending_period = filters.value.trending_period;
    const response = await getGitHubProjects(params);

    if (response.success && response.data) {
      const articles = response.data.list || [];
      if (articles.length > 0) {
        posts.value = articles.map(article => ({
          ...article,
          createTime: article.collect_time || article.created_at,
          views: article.read_count || 0,
          category: 'GitHub项目',
          tags: article.topics ? (typeof article.topics === 'string' ? article.topics.split(',') : article.topics) : [],
          isRecommended: false,
          article_type: 'github_project'
        }));
      } else {
        posts.value = [];
      }
    }

    console.log('API响应数据:', response);
  } catch (error) {
    console.error('获取数据失败', error);
  } finally {
    loading.value = false;
  }
};

// 跳转到详情页
const goToDetail = (post) => {
  console.log('点击的项目数据:', post); // 调试用

  if (post.article_type === 'github_project') {
    // GitHub项目跳转到专门的GitHub项目详情页
    let owner, repo;

    // 从 github_full_name 字段解析 owner/repo
    if (post.github_full_name) {
      const parts = post.github_full_name.split('/');
      if (parts.length === 2) {
        owner = parts[0];
        repo = parts[1];
      }
    }

    // 如果没有 github_full_name，尝试其他字段
    if (!owner || !repo) {
      owner = post.owner || post.github_info?.owner;
      repo = post.name || post.repo || post.github_info?.name;
    }

    if (owner && repo) {
      router.push(`/github/${owner}/${repo}`);
    } else {
      console.error('无法解析项目的 owner/repo:', post);
    }
  } else {
    // 普通文章跳转到文章详情页
    router.push(`/post/${post.id}`);
  }
};

// 获取卡片背景色
const getCardBackground = (post) => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  ];
  const index = post.id ? post.id % colors.length : 0;
  return { background: colors[index] };
};

// 格式化数字
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// 格式化时间
const formatTime = (time) => {
  if (!time) return '未知时间';

  const date = new Date(time);
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '时间格式错误';
  }

  const now = new Date();
  const diff = now - date;

  // 如果时间差为负数或无效，显示原始时间
  if (diff < 0 || isNaN(diff)) {
    return date.toLocaleDateString('zh-CN');
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
  }
  if (hours < 24) {
    return `${hours}小时前`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}天前`;
  }
  // 超过30天显示具体日期
  return date.toLocaleDateString('zh-CN');
};

// 获取标签颜色
const getTagColor = (post) => {
  if (post.article_type === 'github_project') {
    return '#2563eb'; // 蓝色，表示GitHub项目
  }
  return '#6366f1'; // 默认紫色
};

// 获取标签文本
const getTagLabel = (post) => {
  if (post.article_type === 'github_project') {
    return 'GitHub项目';
  }
  return post.category || '文章';
};

// 获取项目的 topics 标签
const getTopics = (post) => {
  if (!post.topics) return [];

  // 如果是字符串，按逗号分割
  if (typeof post.topics === 'string') {
    return post.topics.split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  // 如果是数组，直接返回
  if (Array.isArray(post.topics)) {
    return post.topics;
  }

  return [];
};

onMounted(() => {
  fetchData();
});


</script> 