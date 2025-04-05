<template>
  <div class="min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 py-10">
    <!-- 包裹容器，确保PC端两边留白，内容区固定1200px -->
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
      <h1 class="text-3xl font-bold mb-8 text-center text-white !text-white" style="color: white !important;">AI资讯中心</h1>
      
      <!-- 使用flex布局代替Row+Col固定span -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
                  {{ post.readTime }}
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
import { getAllPosts } from '@/utils/mockData';
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

onMounted(() => {
  posts.value = getAllPosts();
});

// 跳转到文章详情
const goToDetail = (id) => {
  router.push({ name: 'PostDetail', params: { id } });
};
</script> 