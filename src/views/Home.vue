<template>
  <div class="min-h-screen bg-white py-10">
    <!-- 包裹容器，确保PC端两边留白，内容区固定1200px -->
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
      <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">肥猫项目分析</h1>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-gray-600 text-xl">加载中...</div>
      </div>

      <!-- 数据为空状态 -->
      <div v-else-if="posts.length === 0" class="flex justify-center items-center py-20">
        <div class="text-gray-600 text-xl">暂无数据</div>
      </div>
      
      <!-- 数据列表 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="post in posts" :key="post.id" class="w-full">
          <Card class="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden rounded-lg border border-gray-200" hoverable @click="goToDetail(post)">
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

            <div class="p-4">
              <!-- GitHub项目标题 -->
              <template v-if="post.article_type === 'github_project'">
                <h2 class="text-lg font-bold mb-2 overflow-hidden line-clamp-2 text-gray-800">
                  {{ post.github_info?.full_name || post.title }}
                </h2>
                <div class="flex items-center gap-2 mb-2">
                  <Tag v-if="post.github_info?.language" color="#2196F3" class="border-0 text-xs">
                    {{ post.github_info.language }}
                  </Tag>
                  <span class="text-xs text-yellow-600 flex items-center">
                    ⭐ {{ formatNumber(post.github_info?.stars || 0) }}
                  </span>
                  <span class="text-xs text-gray-500 flex items-center">
                    🍴 {{ formatNumber(post.github_info?.forks || 0) }}
                  </span>
                </div>
                <p class="text-gray-600 text-sm overflow-hidden line-clamp-3 mb-3">
                  {{ post.github_info?.translated_description || post.github_info?.original_description || '暂无描述' }}
                </p>
                <div class="flex flex-wrap mb-3">
                  <Tag v-for="tag in (post.github_info?.topics || []).slice(0, 3)" :key="tag"
                       class="mr-1 mb-1 border-0 bg-gray-100 text-gray-700 text-xs">
                    {{ tag }}
                  </Tag>
                </div>
              </template>

              <!-- 普通文章标题 -->
              <template v-else>
                <h2 class="text-lg font-bold mb-2 overflow-hidden line-clamp-2 text-gray-800">{{ post.title }}</h2>
                <p class="text-gray-600 text-sm overflow-hidden line-clamp-3 mb-3">{{ post.description }}</p>
                <div class="flex flex-wrap mb-3">
                  <Tag v-for="tag in post.tags" :key="tag" class="mr-1 mb-1 border-0 bg-gray-100 text-gray-700 text-xs">{{ tag }}</Tag>
                </div>
              </template>

              <div class="flex text-xs text-gray-500 items-center justify-between border-t pt-3 mt-auto">
                <span class="flex items-center">
                  <clock-circle-outlined class="mr-1 text-xs" />
                  {{ post.createTime || post.collectTime }}
                </span>
                <span class="flex items-center">
                  <eye-outlined class="mr-1 text-xs" />
                  {{ post.views || post.readCount || 0 }}
                </span>
              </div>
            </div>
          </Card>
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
import { Card, Tag } from 'ant-design-vue';
import { 
  ClockCircleOutlined, 
  EyeOutlined,
  FileTextOutlined,
  HtmlOutlined,
  ApiOutlined,
  CodeOutlined,
  NodeIndexOutlined,
  DeploymentUnitOutlined,
  BlockOutlined,
  BoxPlotOutlined,
  LayoutOutlined,
  CloudServerOutlined,
  ContainerOutlined
} from '@ant-design/icons-vue';
import { getGitHubProjects } from '../api/github.js';

const iconComponents = {
  'file-text': FileTextOutlined,
  'html5': HtmlOutlined,
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

// 简化的响应式数据，只保留博客功能

// 获取GitHub项目数据
const fetchData = async () => {
  try {
    loading.value = true;

    // 获取GitHub项目
    const response = await getGitHubProjects({
      page: 1,
      pageSize: 20
    });

    if (response.success && response.data) {
      const articles = response.data.list || [];
      posts.value = articles.map(article => ({
        ...article,
        createTime: formatTime(article.collect_time),
        views: article.read_count || 0,
        category: 'GitHub项目',
        tags: article.topics ? (typeof article.topics === 'string' ? article.topics.split(',') : article.topics) : [],
        isRecommended: false,
        article_type: 'github_project'
      }));
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
  if (post.article_type === 'github_project') {
    router.push(`/github/${post.github_info?.full_name || post.github_full_name}`);
  } else {
    router.push(`/article/${post.id}`);
  }
};

// 获取卡片背景
const getCardBackground = (post) => {
  if (post.article_type === 'github_project') {
    // GitHub项目使用渐变背景
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const colorIndex = (post.github_id || post.id) % colors.length;
    return { background: `linear-gradient(135deg, ${colors[colorIndex]}, ${colors[(colorIndex + 1) % colors.length]})` };
  } else if (post.cover) {
    return {};
  } else {
    return { backgroundColor: post.coverColor };
  }
};

// 获取标签颜色
const getTagColor = (post) => {
  if (post.article_type === 'github_project') {
    return '#6366f1';
  }
  return post.isRecommended ? '#6366f1' : '#10b981';
};

// 获取标签文本
const getTagLabel = (post) => {
  if (post.article_type === 'github_project') {
    return 'GitHub';
  }
  return post.isRecommended ? '推荐' : post.category;
};

// 格式化数字
const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};



onMounted(() => {
  fetchData();
});



// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return '未知时间';
  
  try {
    // 解析ISO日期字符串
    const date = new Date(timeStr);
    const now = new Date();
    
    // 计算天数差
    const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
    
    // 移除时间部分，只保留日期
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowWithoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // 计算整天数的差异
    const diffDays = Math.round((nowWithoutTime - dateWithoutTime) / oneDay);
    
    if (diffDays === 0) {
      // 今天发布的
      const diffHours = now.getHours() - date.getHours();
      
      if (diffHours === 0) {
        const diffMinutes = now.getMinutes() - date.getMinutes();
        return diffMinutes <= 0 ? '刚刚' : `${diffMinutes}分钟前`;
      }
      
      return `${diffHours}小时前`;
    } else if (diffDays < 30) {
      // 一个月内
      return `${diffDays}天前`;
    } else {
      // 超过一个月，显示具体日期
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  } catch (error) {
    // 出错时返回原始时间字符串，去掉T和毫秒部分
    return timeStr.replace('T', ' ').split('.')[0];
  }
};


</script> 