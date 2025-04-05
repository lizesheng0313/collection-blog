<template>
  <div class="min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 py-10">
    <!-- 包裹容器，确保PC端两边留白，内容区固定1200px -->
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6">
      <!-- 具体文章内容区宽度更窄，便于阅读 -->
      <div class="max-w-[800px] mx-auto">
        <a @click="goBack" class="group inline-flex items-center mb-6 text-white transition-all duration-300 hover:text-indigo-200 cursor-pointer">
          <div class="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 bg-opacity-30 mr-2 group-hover:bg-opacity-50 transition-all duration-300">
            <arrow-left-outlined class="text-sm" />
          </div>
          <span class="text-sm font-medium">返回首页</span>
        </a>
        
        <div v-if="loading" class="text-center py-10 bg-white rounded-lg shadow-lg">
          <div class="text-lg">加载中...</div>
        </div>
        
        <template v-else-if="post">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="relative">
              <!-- 优先显示远程图片 -->
              <div v-if="post.cover" class="w-full h-64 md:h-80">
                <img :src="post.cover" alt="cover" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-full h-64 md:h-80 flex items-center justify-center" :style="{backgroundColor: post.coverColor}">
                <component :is="iconComponents[post.coverIcon || 'file-text']" class="text-9xl text-white opacity-80" />
              </div>
              <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div class="text-center text-white p-5">
                  <h1 class="text-2xl md:text-4xl font-bold mb-4">{{ post.title }}</h1>
                  <div class="flex flex-wrap justify-center gap-2 mb-3">
                    <Tag v-for="tag in post.tags" :key="tag" color="#6366f1" class="border-0">{{ tag }}</Tag>
                  </div>
                  <div class="flex justify-center items-center text-sm md:text-base opacity-80 space-x-4">
                    <span class="flex items-center">
                      <calendar-outlined class="mr-1 text-sm" />
                      {{ post.createTime }}
                    </span>
                    <span class="flex items-center">
                      <clock-circle-outlined class="mr-1 text-sm" />
                      {{ post.readTime }}
                    </span>
                    <span class="flex items-center">
                      <eye-outlined class="mr-1 text-sm" />
                      {{ post.views }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="p-5 md:p-8">
              <div class="leading-relaxed" v-html="post.content"></div>
            </div>
          </div>

          <!-- 推荐阅读 -->
          <div class="mt-10" v-if="recommendedPosts.length > 0">
            <h3 class="text-xl font-bold mb-6 text-white !text-white text-center" style="color: white !important;">推荐阅读</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="item in recommendedPosts" :key="item.id" class="w-full">
                <a @click.prevent="goToPost(item.id)" class="cursor-pointer block">
                  <Card class="h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl rounded-lg overflow-hidden">
                    <!-- 优先显示远程图片 -->
                    <div v-if="item.cover" class="relative h-40">
                      <img :src="item.cover" alt="cover" class="w-full h-full object-cover" />
                      <div class="absolute top-2 left-2">
                        <Tag color="#6366f1" class="border-0">{{ item.category }}</Tag>
                      </div>
                    </div>
                    <div v-else class="relative h-40 flex items-center justify-center" :style="{backgroundColor: item.coverColor}">
                      <component :is="iconComponents[item.coverIcon || 'file-text']" class="text-6xl text-white opacity-80" />
                      <div class="absolute top-2 left-2">
                        <Tag color="#6366f1" class="border-0">{{ item.category }}</Tag>
                      </div>
                    </div>
                    <div class="p-4">
                      <h3 class="text-lg font-semibold overflow-hidden line-clamp-2 mb-2">{{ item.title }}</h3>
                      <p class="text-gray-600 text-sm overflow-hidden line-clamp-2">{{ item.description }}</p>
                    </div>
                  </Card>
                </a>
              </div>
            </div>
          </div>
        </template>
        
        <div v-else class="text-center py-10 bg-white rounded-lg shadow-lg">
          <div class="text-lg mb-4">文章不存在</div>
          <a @click="goBack" class="group inline-flex items-center justify-center text-indigo-600 transition-all duration-300 hover:text-indigo-800 cursor-pointer">
            <div class="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-100 mr-2 group-hover:bg-indigo-200 transition-all duration-300">
              <arrow-left-outlined class="text-sm" />
            </div>
            <span class="text-sm font-medium">返回首页</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostDetailPage'
}
</script>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPostContent, getRecommendedPosts } from '@/utils/mockData';
import { Tag, Card } from 'ant-design-vue';
import { 
  ClockCircleOutlined, 
  EyeOutlined, 
  CalendarOutlined, 
  ArrowLeftOutlined,
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
  'typescript': CodeOutlined
};

const route = useRoute();
const router = useRouter();
const post = ref(null);
const recommendedPosts = ref([]);
const loading = ref(true);

onMounted(() => {
  const postId = route.params.id;
  if (postId) {
    post.value = getPostContent(postId);
    recommendedPosts.value = getRecommendedPosts().filter(p => p.id != postId).slice(0, 3);
  }
  loading.value = false;
});

const goToPost = (id) => {
  if (route.params.id === id) {
    window.location.reload();
  } else {
    router.push({ name: 'PostDetail', params: { id } });
  }
};

const goBack = () => {
  router.push({ name: 'Home' });
};
</script> 