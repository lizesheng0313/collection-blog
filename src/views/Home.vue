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
              <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">肥猫猫GitHub项目精选</h1>
              <p class="text-gray-600 mt-2">发现优质开源项目，挖掘商业价值与技术机会</p>
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

      <!-- 搜索框 -->
      <div v-if="!loading" class="mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="max-w-2xl mx-auto">
            <a-input-search
              v-model:value="searchKeyword"
              placeholder="搜索项目名称、描述或标签..."
              size="large"
              @search="handleSearch"
              class="w-full"
            >
              <template #enterButton>
                <a-button type="primary" size="large">搜索</a-button>
              </template>
            </a-input-search>
            <div v-if="searchKeyword" class="mt-3 text-center">
              <a-button @click="clearSearch" size="small" type="link">
                清除搜索条件
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选条件 -->
      <div v-if="!loading" class="mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between min-h-[48px]">
            <div class="flex items-center space-x-4">
              <h2 class="text-lg font-semibold text-gray-800 leading-none !mb-0">
                {{ isSearchMode ? '搜索结果' : '热门趋势' }}
              </h2>
              <a-radio-group
                v-if="!isSearchMode"
                v-model:value="filters.trending_period"
                @update:value="handleFilterChange"
                size="large"
                class="bg-gray-50 rounded-lg p-1"
              >
                <a-radio-button value="daily" class="px-6 py-2">今日热门</a-radio-button>
                <a-radio-button value="weekly" class="px-6 py-2">本周精选</a-radio-button>
                <a-radio-button value="monthly" class="px-6 py-2">月度推荐</a-radio-button>
              </a-radio-group>
              <div v-if="isSearchMode" class="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                搜索: "{{ searchKeyword }}"
              </div>
            </div>
            <div class="text-sm text-gray-500 leading-none">
              共找到 {{ pagination.total || posts.length }} 个优质项目
              <span v-if="posts.length < pagination.total" class="text-blue-600">
                (已显示 {{ posts.length }} 个)
              </span>
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
            <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ post.github_info?.full_name || post.github_full_name || post.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{{ post.github_info?.translated_description || post.translated_description || post.github_info?.original_description || post.original_description || post.content }}</p>

            <!-- 统计信息 -->
            <div class="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-4 text-sm">
                <span class="flex items-center text-yellow-600">
                  <StarOutlined class="mr-1" />
                  <span class="font-medium">{{ formatNumber(post.github_info?.stars || post.stars_count || 0) }}</span>
                </span>
                <span class="flex items-center text-blue-600">
                  <ForkOutlined class="mr-1" />
                  <span class="font-medium">{{ formatNumber(post.github_info?.forks || post.forks_count || 0) }}</span>
                </span>
              </div>
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

        <!-- 加载更多状态 -->
        <div class="mt-12 text-center">
          <!-- 加载中状态 -->
          <div v-if="loadingMore" class="flex justify-center items-center py-8">
            <div class="flex items-center space-x-3">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <div class="text-gray-600">正在加载更多项目...</div>
            </div>
          </div>

          <!-- 没有更多数据 -->
          <div v-else-if="!pagination.hasMore && posts.length > 0" class="py-8">
            <div class="text-gray-500 text-sm">
              <div class="flex items-center justify-center space-x-2">
                <div class="w-16 h-px bg-gray-300"></div>
                <span>已显示全部 {{ posts.length }} 个项目</span>
                <div class="w-16 h-px bg-gray-300"></div>
              </div>
            </div>
          </div>

          <!-- 手动加载更多按钮 -->
          <div v-if="pagination.hasMore && !loadingMore && posts.length > 0" class="py-8 text-center">
            <button
              @click="fetchData(true)"
              class="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md font-medium"
            >
              加载更多项目 ({{ pagination.total - posts.length }} 项待加载)
            </button>
            <div class="mt-2 text-sm text-gray-500">
              或继续滚动自动加载
            </div>
          </div>

          <!-- 分页信息 -->
          <div v-if="posts.length > 0" class="py-6 border-t border-gray-200 mt-8">
            <div class="flex items-center justify-between text-sm text-gray-600">
              <div>
                显示第 1 - {{ posts.length }} 项，共 {{ pagination.total }} 项结果
                <span v-if="isSearchMode" class="ml-2 text-blue-600">
                  (搜索: "{{ searchKeyword }}")
                </span>
              </div>
              <div v-if="pagination.hasMore" class="text-blue-600">
                继续滚动加载更多...
              </div>
              <div v-else-if="posts.length > 0" class="text-gray-500">
                已显示全部结果
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
import { ref, onMounted, onUnmounted } from 'vue';
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
import axios from 'axios';

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
const loadingMore = ref(false);
const filters = ref({ trending_period: 'daily' });
const searchKeyword = ref('');
const isSearchMode = ref(false); // 是否处于搜索模式

// 分页状态管理
const pagination = ref({
  currentPage: 1,
  pageSize: 20,
  hasMore: true,
  total: 0
});

// 处理筛选条件变化
const handleFilterChange = (value) => {
  console.log('handleFilterChange called:', value);
  filters.value.trending_period = value;
  fetchData();
};

// 获取GitHub项目数据
const fetchData = async (isLoadMore = false) => {
  try {
    // 防止重复加载
    if (isLoadMore && (loadingMore.value || !pagination.value.hasMore)) {
      return;
    }

    // 防止重复的首次加载
    if (!isLoadMore && loading.value) {
      return;
    }

    if (isLoadMore) {
      loadingMore.value = true;
    } else {
      loading.value = true;
      // 重置分页状态
      pagination.value.currentPage = 1;
      pagination.value.hasMore = true;
      posts.value = [];
    }

    let response;

    // 如果处于搜索模式，使用统一搜索接口
    if (isSearchMode.value && searchKeyword.value.trim()) {
      const searchParams = {
        keyword: searchKeyword.value.trim(),
        page: pagination.value.currentPage,
        pageSize: pagination.value.pageSize,
        article_type: 'github_project'
      };
      // 使用统一的搜索API
      response = await axios.get('/api/articles/search', { params: searchParams });
    } else {
      // 没有搜索时使用普通项目列表接口
      const params = {
        page: pagination.value.currentPage,
        pageSize: pagination.value.pageSize
      };
      if (filters.value.trending_period) params.trending_period = filters.value.trending_period;
      response = await getGitHubProjects(params);
    }

    // 统一处理响应数据结构
    // 搜索API使用axios直接调用，普通列表API使用request函数（被拦截器处理）
    const responseData = isSearchMode.value ? response.data : response;

    if (responseData?.success && responseData?.data) {
      let articles, total;

      // 统一使用list字段处理数据格式
      articles = responseData.data.list || [];
      total = responseData.data.total || articles.length;

      const formattedArticles = articles.map(article => ({
        ...article,
        createTime: article.collect_time || article.created_at,
        views: article.read_count || 0,
        category: 'GitHub项目',
        tags: article.topics ? (typeof article.topics === 'string' ? article.topics.split(',') : article.topics) : [],
        isRecommended: false,
        article_type: 'github_project',
        // 确保搜索结果的必要字段
        id: article.id || article.github_id,
        title: article.title || article.name || article.full_name,
        description: article.translated_description || article.description || article.summary || '',
        url: article.github_url || article.url || article.html_url,
        stars: article.stars_count || article.stars || article.stargazers_count || 0,
        forks: article.forks_count || article.forks || 0,
        language: article.programming_language || article.language || article.primary_language,
        updated_at: article.updated_at || article.pushed_at,
        owner: article.owner || (article.github_full_name ? article.github_full_name.split('/')[0] : ''),
        repo: article.repo || article.name || (article.github_full_name ? article.github_full_name.split('/')[1] : ''),
        avatar_url: article.avatar_url || (article.owner && article.owner.avatar_url),
        // 添加搜索结果特有的字段
        github_full_name: article.github_full_name,
        overall_score: article.overall_score
      }));

      if (isLoadMore) {
        // 加载更多：追加到现有列表
        posts.value.push(...formattedArticles);
      } else {
        // 首次加载：替换列表
        posts.value = formattedArticles;
      }

      // 更新分页状态
      pagination.value.total = total;
      pagination.value.hasMore = articles.length === pagination.value.pageSize && posts.value.length < total;

      if (isLoadMore) {
        pagination.value.currentPage++;
      } else {
        pagination.value.currentPage = 2; // 下次加载第2页
      }


    }
  } catch (error) {
    console.error('获取数据失败', error);
  } finally {
    if (isLoadMore) {
      loadingMore.value = false;
    } else {
      loading.value = false;
    }
  }
};

// 跳转到详情页
const goToDetail = (post) => {
  console.log('点击的项目数据:', post); // 调试用

  if (post.article_type === 'github_project') {
    // GitHub项目跳转到专门的GitHub项目详情页
    let owner, repo;

    // 优先从 github_info 获取
    const fullName = post.github_info?.full_name || post.github_full_name;

    if (fullName) {
      const parts = fullName.split('/');
      if (parts.length === 2) {
        owner = parts[0];
        repo = parts[1];
      }
    }

    // 如果还没有，尝试其他字段
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

// 格式化时间 - 简单的年月日格式
const formatTime = (time) => {
  if (!time) return '未知时间';

  const date = new Date(time);
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '时间格式错误';
  }

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
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
  // 优先使用 github_info 中的 topics
  let topics = post.github_info?.topics || post.topics;

  if (!topics) return [];

  // 如果是字符串，按逗号分割
  if (typeof topics === 'string') {
    return topics.split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  // 如果是数组，直接返回
  if (Array.isArray(topics)) {
    return topics;
  }

  return [];
};

// 滚动监听逻辑
const handleScroll = () => {
  // 防抖处理
  if (loadingMore.value || !pagination.value.hasMore || loading.value) {
    return;
  }

  // 确保有数据才允许加载更多
  if (posts.value.length === 0) {
    return;
  }

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // 当滚动到距离底部200px时开始加载
  if (scrollTop + windowHeight >= documentHeight - 200) {
    fetchData(true);
  }
};

// 鼠标滚轮监听逻辑
const handleWheel = (event) => {
  // 防抖处理
  if (loadingMore.value || !pagination.value.hasMore || loading.value) {
    return;
  }

  // 确保有数据才允许加载更多
  if (posts.value.length === 0) {
    return;
  }

  // 只在向下滚动时触发
  if (event.deltaY > 0) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 当滚动到距离底部300px时开始加载
    if (scrollTop + windowHeight >= documentHeight - 300) {
      fetchData(true);
    }
  }
};

// 搜索处理
const handleSearch = () => {
  // 防止重复调用
  if (loading.value) {
    return;
  }

  if (!searchKeyword.value.trim()) {
    clearSearch();
    return;
  }

  isSearchMode.value = true; // 进入搜索模式
  pagination.value.currentPage = 1;
  pagination.value.hasMore = true;
  posts.value = [];
  fetchData();
};

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = '';
  isSearchMode.value = false; // 退出搜索模式
  pagination.value.currentPage = 1;
  pagination.value.hasMore = true;
  posts.value = [];
  fetchData();
};

// 节流函数
const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

const throttledHandleScroll = throttle(handleScroll, 200);
const throttledHandleWheel = throttle(handleWheel, 200);

onMounted(() => {
  fetchData();
  // 设置页面标题
  document.title = 'GitHub项目精选 - 发现优质开源项目和商业机会';

  // 添加滚动监听
  window.addEventListener('scroll', throttledHandleScroll);
  // 添加鼠标滚轮监听
  window.addEventListener('wheel', throttledHandleWheel, { passive: true });
});

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', throttledHandleScroll);
  // 移除鼠标滚轮监听
  window.removeEventListener('wheel', throttledHandleWheel);
});


</script> 