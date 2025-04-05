// 模拟博客文章数据
const posts = [
  {
    id: 1,
    title: 'Aurora 自定义容器 (Custom Containers)',
    description: 'Aurora 添加了与 VuePress 一样的自定义容器, 包括提示 (tip)、注意 (warning)、特别注意 (danger) 和隐藏内容 (details)...',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    coverIcon: 'container',
    coverColor: '#8B5CF6',
    tags: ['前端', '博客'],
    category: '前端',
    isRecommended: true,
    createTime: '2021-05-02',
    readTime: '2 分钟',
    views: 2500
  },
  {
    id: 2,
    title: '实战中学习浏览器工作原理 — HTML 解析与CSS 计算',
    description: '上一部分我们完成了从 HTTP 发送 Request, 到接收到 Response, 并且把 Response 中的文本都解析出来。这一部分我们主要讲解如何做 H...',
    cover: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    coverIcon: 'html5',
    coverColor: '#F97316',
    tags: ['浏览器', '前端'],
    category: '前端',
    isRecommended: false,
    createTime: '2020-08-23',
    readTime: '3 分钟',
    views: 1800
  },
  {
    id: 3,
    title: '浏览器工作原理 — 之 HTTP 请求与解析',
    description: '浏览器工作原理是一块非常重要的内容，我们经常看到的 重绘、重排 或者一些讲解 CSS 属性的时候，都会用到一些浏览器工作原理的知识来讲解。理论化学习浏览器工作...',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
    coverIcon: 'api',
    coverColor: '#10B981',
    tags: ['浏览器', '前端'],
    category: '前端',
    isRecommended: false,
    createTime: '2020-08-15',
    readTime: '4 分钟',
    views: 2200
  },
  {
    id: 4,
    title: 'Vue3 Composition API 实战指南',
    description: 'Vue3带来了全新的Composition API，它为代码组织和逻辑复用带来了革命性的变化。本文将详细介绍如何在实际项目中充分利用Composition API...',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
    coverIcon: 'code',
    coverColor: '#3B82F6',
    tags: ['Vue', '前端'],
    category: '前端',
    isRecommended: true,
    createTime: '2021-06-10',
    readTime: '5 分钟',
    views: 3100
  },
  {
    id: 5,
    title: 'TypeScript高级类型实战',
    description: '深入理解TypeScript的高级类型系统，包括条件类型、映射类型、联合类型和交叉类型等，通过实际案例讲解如何提高代码的类型安全性...',
    cover: 'https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp',
    coverIcon: 'typescript',
    coverColor: '#0EA5E9',
    tags: ['TypeScript', '前端'],
    category: '前端',
    isRecommended: false,
    createTime: '2021-07-15',
    readTime: '6 分钟',
    views: 2800
  },
  {
    id: 6,
    title: 'Node.js微服务架构设计',
    description: '探讨如何使用Node.js构建可扩展的微服务架构，包括服务发现、负载均衡、容错机制以及部署策略等关键方面...',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
    coverIcon: 'node',
    coverColor: '#059669',
    tags: ['Node.js', '后端'],
    category: '后端',
    isRecommended: true,
    createTime: '2021-08-05',
    readTime: '7 分钟',
    views: 3500
  },
  {
    id: 7,
    title: 'React性能优化最佳实践',
    description: '介绍React应用中提升性能的各种技巧，包括组件懒加载、虚拟化列表、缓存计算结果以及减少不必要的渲染等...',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/uVZonEtjWwmUZPBQfycs.png',
    coverIcon: 'react',
    coverColor: '#2563EB',
    tags: ['React', '性能优化'],
    category: '前端',
    isRecommended: false,
    createTime: '2021-08-20',
    readTime: '5 分钟',
    views: 2900
  },
  {
    id: 8,
    title: 'GraphQL与REST API比较',
    description: '深入分析GraphQL和REST API的优缺点，适用场景以及如何选择适合自己项目的API设计模式...',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
    coverIcon: 'deployment-unit',
    coverColor: '#EC4899',
    tags: ['GraphQL', 'API'],
    category: '后端',
    isRecommended: true,
    createTime: '2021-09-10',
    readTime: '4 分钟',
    views: 2600
  },
  {
    id: 9,
    title: 'WebAssembly前端应用实战',
    description: '探索WebAssembly如何在现代前端应用中发挥作用，包括性能密集型运算、游戏开发和多媒体处理等领域的应用案例...',
    cover: 'https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp',
    coverIcon: 'block',
    coverColor: '#6366F1',
    tags: ['WebAssembly', '性能优化'],
    category: '前端',
    isRecommended: false,
    createTime: '2021-09-25',
    readTime: '6 分钟',
    views: 3200
  },
  {
    id: 10,
    title: 'Docker容器化部署前端应用',
    description: '详解如何使用Docker容器化部署现代前端应用，包括多阶段构建、优化镜像大小、整合CI/CD流程等实用技巧...',
    cover: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IAY2%26/willi-santiago-aLGiPJ4XRO4-unsplash.webp',
    coverIcon: 'box-plot',
    coverColor: '#0891B2',
    tags: ['Docker', 'DevOps'],
    category: '运维',
    isRecommended: true,
    createTime: '2021-10-15',
    readTime: '5 分钟',
    views: 2700
  },
  {
    id: 11,
    title: 'CSS Grid布局系统详解',
    description: 'CSS Grid布局系统的全面指南，从基础概念到高级技巧，帮助你掌握现代网页布局的强大工具...',
    cover: 'https://gw.alipayobjects.com/zos/antfincdn/7vod7BdXB%26/ian-dooley-d1UPkiFd04A-unsplash.webp',
    coverIcon: 'layout',
    coverColor: '#16A34A',
    tags: ['CSS', '布局'],
    category: '前端',
    isRecommended: false,
    createTime: '2021-10-30',
    readTime: '4 分钟',
    views: 2400
  },
  {
    id: 12,
    title: 'Serverless架构实战',
    description: '探讨Serverless架构的优势、挑战以及在实际项目中的应用，包括AWS Lambda、Azure Functions等平台的使用案例...',
    cover: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    coverIcon: 'cloud-server',
    coverColor: '#9333EA',
    tags: ['Serverless', '云计算'],
    category: '云服务',
    isRecommended: true,
    createTime: '2021-11-15',
    readTime: '7 分钟',
    views: 3800
  }
];

// 获取文章详情
export const getPostById = (id) => {
  return posts.find(post => post.id == id);
};

// 获取推荐文章
export const getRecommendedPosts = () => {
  return posts.filter(post => post.isRecommended);
};

// 获取所有文章
export const getAllPosts = () => {
  return posts;
};

// 获取文章详细内容（模拟）
export const getPostContent = (id) => {
  const post = getPostById(id);
  return {
    ...post,
    content: `
<div class="text-xl md:text-2xl font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800">自定义容器示例</div>

<div class="bg-gray-50 border-l-4 border-indigo-500 p-4 my-4 rounded text-gray-700">
  <p>自从版本 1.5.0，Aurora 添加了与 VuePress 一样的自定义容器，包括 提示 (tip)、 注意 (warning)、 特别注意 (danger) 和 隐藏内容 (details)</p>
</div>

<div class="text-xl md:text-2xl font-semibold my-6 pb-2 border-b border-gray-200 text-gray-800">引用块</div>

<div class="bg-gray-50 border-l-4 border-indigo-500 p-4 my-4 rounded text-gray-700">
  <p>普通引用块</p>
</div>

<p class="mb-5 leading-7 text-gray-600">这里是文章的主要内容，可以包含丰富的格式和详细的信息。可以有多个段落，引用，代码块等等。</p>

<div class="bg-gray-900 text-gray-300 p-4 rounded-md overflow-x-auto my-5 font-mono text-sm">
// 这里是一些示例代码
function example() {
  console.log('这是一个示例函数');
  return '示例返回值';
}
</div>

<p class="mb-5 leading-7 text-gray-600">这篇文章还可以包含更多的段落和内容，以及各种富文本格式。</p>
`
  };
};

export default {
  getAllPosts,
  getPostById,
  getRecommendedPosts,
  getPostContent
}; 