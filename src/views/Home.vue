<template>
  <div class="min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 py-10">
    <!-- 包裹容器，确保PC端两边留白，内容区固定1200px -->
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
      <h1 class="text-3xl font-bold mb-8 text-center text-white !text-white" style="color: white !important;">AI资讯中心</h1>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-white text-xl">加载中...</div>
      </div>
      
      <!-- 数据为空状态 -->
      <div v-else-if="posts.length === 0" class="flex justify-center items-center py-20">
        <div class="text-white text-xl">暂无数据</div>
      </div>
      
      <!-- 数据列表 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="post in posts" :key="post.id" class="w-full">
          <Card class="h-full hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 overflow-hidden rounded-lg" hoverable @click="goToDetail(post.id)">
            <div class="relative h-48 flex items-center justify-center" :style="post.cover ? {} : {backgroundColor: post.coverColor}">
              <!-- 优先显示图片，如果没有图片才显示图标 -->
              <template v-if="post.cover">
                <img :src="post.cover" alt="cover" class="w-full h-full object-cover" />
              </template>
              <template v-else>
                <component :is="iconComponents[post.coverIcon || 'file-text']" class="text-7xl text-white opacity-80" />
              </template>
              <div class="absolute top-2 left-2">
                <Tag :color="post.isRecommended ? '#6366f1' : '#10b981'" class="border-0">
                  {{ post.isRecommended ? '推荐' : post.category }}
                </Tag>
              </div>
            </div>
            <div class="p-4">
              <h2 class="text-lg font-bold mb-2 overflow-hidden line-clamp-2 text-gray-800">{{ post.title }}</h2>
              <p class="text-gray-600 text-sm overflow-hidden line-clamp-3 mb-3">{{ post.description }}</p>
              <div class="flex flex-wrap mb-3">
                <Tag v-for="tag in post.tags" :key="tag" class="mr-1 mb-1 border-0 bg-indigo-100 text-indigo-800">{{ tag }}</Tag>
              </div>
              <div class="flex text-xs text-gray-500 items-center justify-between border-t pt-3 mt-auto">
                <span class="flex items-center">
                  <clock-circle-outlined class="mr-1 text-xs" />
                  {{ post.createTime }}
                </span>
                <span class="flex items-center">
                  <eye-outlined class="mr-1 text-xs" />
                  {{ post.views }}
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
import { getArticleList } from '../api/article.js';

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

onMounted(async () => {
  try {
    loading.value = true;
    const response = await getArticleList({ page: 1, pageSize: 20 });
    console.log('API响应数据:', response);
    
    if (response.success && response.data) {
      console.log('文章列表数据:', JSON.stringify(response.data.list[0])); // 输出第一篇文章的完整数据
      
      // 转换API返回的数据格式为组件所需格式
      posts.value = response.data.list.map(item => {
        console.log('文章创建时间原始值:', item.created_at);
        const formattedTime = formatTime(item.created_at);
        console.log('格式化后的时间:', formattedTime);
        
        const mappedPost = {
          id: item.id,
          title: item.title,
          description: item.summary || '',
          cover: item.thumbnail || '',
          coverIcon: 'file-text', // 默认图标
          coverColor: getCoverColor(item.category_id || 0),
          tags: item.tags ? item.tags.split(',') : [],
          category: item.source || '未分类',
          isRecommended: item.is_recommend === 1,
          createTime: formattedTime,
          readTime: `${Math.ceil((item.content?.length || 0) / 500)} 分钟`,
          views: item.read_count || 0
        };
        
        console.log('映射后的文章对象:', mappedPost);
        return mappedPost;
      });
    }
  } catch (error) {
    console.error('获取文章列表失败', error);
  } finally {
    loading.value = false;
  }
});

// 根据分类ID获取封面颜色
const getCoverColor = (categoryId) => {
  const colors = [
    '#8B5CF6', '#3B82F6', '#10B981', '#F97316', 
    '#EC4899', '#0891B2', '#16A34A', '#9333EA'
  ];
  return colors[categoryId % colors.length];
};

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

// 跳转到文章详情
const goToDetail = (id) => {
  router.push({ name: 'PostDetail', params: { id } });
};
</script> 