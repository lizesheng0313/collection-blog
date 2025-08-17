<template>
  <div class="comment-section">
    <!-- 评论列表 -->
    <div class="comment-list">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-semibold">
          评论 ({{ comments.length }})
        </h4>
        <a-select 
          v-model:value="sortBy" 
          @change="loadComments"
          style="width: 120px"
        >
          <a-select-option value="newest">最新</a-select-option>
          <a-select-option value="oldest">最早</a-select-option>
          <a-select-option value="likes">最热</a-select-option>
        </a-select>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-8">
        <a-spin size="large" />
      </div>

      <!-- 评论为空 -->
      <div v-else-if="comments.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-2">💬</div>
        <div class="text-gray-500">暂无评论，快来发表第一条评论吧！</div>
      </div>

      <!-- 评论项 -->
      <div v-else class="space-y-4">
        <div 
          v-for="comment in comments" 
          :key="comment.id"
          class="comment-item bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {{ comment.nickname.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="font-medium text-gray-900">{{ comment.nickname }}</div>
                <div class="text-sm text-gray-500">{{ formatTime(comment.created_at) }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="likeComment(comment)"
                :class="[
                  'flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors',
                  comment.isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                ]"
              >
                <span>{{ comment.isLiked ? '❤️' : '🤍' }}</span>
                <span>{{ comment.like_count || 0 }}</span>
              </button>
            </div>
          </div>
          <div class="text-gray-700 leading-relaxed">{{ comment.content }}</div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore && comments.length > 0" class="text-center mt-6">
        <a-button @click="loadMoreComments" :loading="loadingMore">
          加载更多评论
        </a-button>
      </div>
    </div>

    <!-- 评论表单 -->
    <div class="comment-form bg-white rounded-lg shadow-md p-6 mt-6">
      <h4 class="text-lg font-semibold mb-4">发表评论</h4>
      <a-form :model="commentForm" @finish="submitComment" layout="vertical">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <a-form-item
            label="昵称"
            name="nickname"
            :rules="[{ required: true, message: '请输入昵称' }]"
          >
            <a-input
              v-model:value="commentForm.nickname"
              placeholder="请输入您的昵称"
              size="large"
            />
          </a-form-item>
          <a-form-item
            label="邮箱"
            name="email"
            :rules="[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]"
          >
            <a-input
              v-model:value="commentForm.email"
              placeholder="请输入您的邮箱"
              size="large"
            />
          </a-form-item>
        </div>
        <a-form-item
          label="评论内容"
          name="content"
          :rules="[{ required: true, message: '请输入评论内容' }]"
        >
          <a-textarea
            v-model:value="commentForm.content"
            placeholder="请输入您的评论..."
            :rows="4"
            size="large"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="submitting"
            size="large"
            class="px-8"
          >
            发表评论
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { getComments, submitComment as apiSubmitComment, likeComment as apiLikeComment } from '@/api/comments'

// eslint-disable-next-line no-undef
const props = defineProps({
  articleId: {
    type: Number,
    required: true
  },
  articleType: {
    type: String,
    default: 'github_project'
  }
})

// 评论表单
const commentForm = reactive({
  nickname: '',
  email: '',
  content: ''
})

// 状态管理
const comments = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const submitting = ref(false)
const sortBy = ref('newest')
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)

// 加载评论
const loadComments = async (isLoadMore = false) => {
  try {
    if (isLoadMore) {
      loadingMore.value = true
    } else {
      loading.value = true
      page.value = 1
      comments.value = []
    }

    const response = await getComments({
      articleId: props.articleId,
      articleType: props.articleType,
      page: page.value,
      pageSize,
      sortBy: sortBy.value
    })

    if (response.success) {
      const newComments = response.data.list || []
      
      if (isLoadMore) {
        comments.value.push(...newComments)
      } else {
        comments.value = newComments
      }

      hasMore.value = newComments.length === pageSize
      if (isLoadMore) {
        page.value++
      } else {
        page.value = 2
      }
    }
  } catch (error) {
    console.error('加载评论失败:', error)
    message.error('加载评论失败')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 加载更多评论
const loadMoreComments = () => {
  loadComments(true)
}

// 提交评论
const submitComment = async () => {
  try {
    submitting.value = true
    
    const response = await apiSubmitComment({
      articleId: props.articleId,
      articleType: props.articleType,
      nickname: commentForm.nickname,
      email: commentForm.email,
      content: commentForm.content
    })

    if (response.success) {
      message.success('评论发表成功！')
      // 清空表单
      commentForm.nickname = ''
      commentForm.email = ''
      commentForm.content = ''
      // 重新加载评论列表
      await loadComments()
    } else {
      message.error(response.message || '评论发表失败')
    }
  } catch (error) {
    console.error('提交评论失败:', error)
    message.error('评论发表失败')
  } finally {
    submitting.value = false
  }
}

// 点赞评论
const likeComment = async (comment) => {
  try {
    const response = await apiLikeComment(comment.id)
    
    if (response.success) {
      // 更新本地状态
      comment.isLiked = !comment.isLiked
      comment.like_count = response.data.like_count
    } else {
      message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('点赞失败:', error)
    message.error('操作失败')
  }
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadComments()
})
</script>

<style scoped>
.comment-section {
  max-width: none;
}

.comment-item {
  transition: all 0.2s ease;
}

.comment-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
