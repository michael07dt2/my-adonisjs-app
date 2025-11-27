<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { router } from '@inertiajs/vue3';
import axios from 'axios';

interface Post {
  id: number;
  name: string;
  title: string;
  content: string;
  viewsCount: number;
  likesCount: number;
  createdAt: Date;
}

const props = defineProps<{
  posts: Post[] 
}>()

// data
const allPostsData = ref<Post[]>([]);
const posts = ref<Post[]>([]);

// paging
const itemsPerPage = ref<5 | 10 | 25 | 50>(10);
const currentPage = ref(1);
const lastPage = ref(1);
const inputPage = ref(1);

// ui
const currentView = ref<'card' | 'list'>('list');
const isModalOpen = ref(false);

// input
const name = ref('');
const title = ref('');
const content = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');

// methods

// 데이터 베이스 불러오기 및 페이지 계산
const getPosts = async (page: number = 1) => {
  try {
    // API로 데이터 불러오기
    const response = await axios.get<Post[]>('/api/posts', {});

    allPostsData.value = response.data;

    const count = itemsPerPage.value;

    // 페이징
    currentPage.value = page;
    lastPage.value = Math.ceil(response.data.length / itemsPerPage.value);

    posts.value = allPostsData.value.slice(
      count * (currentPage.value - 1),
      count * currentPage.value
    );

    inputPage.value = currentPage.value;

    // console.log('DB 받아라!: ', this.posts);
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
  }
};

// 데이터 베이스 저장
const submitPost = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;

  if (!name.value || !title.value || !content.value) {
    errorMessage.value = '이름, 제목, 내용을 모두 입력해주세요.';
    return;
  }

  try {
    // console.log('DB에 폼을 업로드 합니다.');
    const response = await axios.post('/api/posts', {
      name: name.value,
      title: title.value,
      content: content.value,
    });

    console.log('게시글 등록 성공:', response.data);

    isModalOpen.value = false;

    getPosts();
  } catch (error) {
    console.error('게시글 등록 실패:', error);
    errorMessage.value = '게시글 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  } finally {
    isSubmitting.value = false;
  }
};

// 페이지 이동
const goToPage = (targetPage: number) => {
  if (targetPage >= 1 && targetPage <= lastPage.value) {
    getPosts(targetPage);
    inputPage.value = targetPage;
  } else {
    console.error('page 값이 비정상 입니다.');
    inputPage.value = currentPage.value;
  }
};

// 게시물 열기
const goToPost = (postId: number) => {
  console.log('GO TO PAGE', postId);

  router.push({
    name: 'PostDetail',
    params: { id: postId.toString() },
  });
};

// 목록 변경
const changeView = (view: 'card' | 'list') => {
  currentView.value = view;
  inputPage.value = 1;
  localStorage.setItem('boardView', view); // ⭐ 상태 유지
};

// 쿠키 저장
const updateItemsPerPage = () => {
  localStorage.setItem('itemsPerPage', String(itemsPerPage.value));
  getPosts(1);
};

// 한번에 표시할 아이템 개수 바꾸기
const changeItemsPerPage = () => {
  itemsPerPage.value = 10;
};

// 게시물 작성 창
const openModal = () => {
  isModalOpen.value = !isModalOpen.value;
};

// onMounted

onMounted(() => {
  const savedView = localStorage.getItem('boardView');
  if (savedView) {
    currentView.value = savedView as 'card' | 'list';
  }

  const savedItemsPerPage = localStorage.getItem('itemsPerPage');
  if (savedItemsPerPage) {
    itemsPerPage.value = Number(savedItemsPerPage) as 5 | 10 | 25 | 50;
  }

  getPosts(1);
});
</script>

<template>
  <div class="board-app-wrapper min-h-screen">
    <!-- 게시판 본문 -->
    <div class="board-container">
      <!-- 게시판 타이틀 -->
      <h1 class="board-header margin-bo">Kylab 게시판</h1>

      <!-- 게시판 내용 -->
      <div class="view-toggle-area">
        <!-- 게시물 표시 방법 변경 버튼 -->
        <div class="toggle-button-group" role="group">
          <!-- 카드형 선택 버튼 -->
          <button
            @click="
              changeView('card');
              updateItemsPerPage;
              changeItemsPerPage;
            "
            :class="[
              // active 상태 클래스는 템플릿에서 직접 바인딩
              currentView === 'card'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50',
              'toggle-button',
              'rounded-l-lg',
            ]"
          >
            카드형
          </button>

          <!-- 목록형 선택 버튼 -->
          <button
            @click="changeView('list')"
            :class="[
              currentView === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50',
              'toggle-button',
              'rounded-r-lg',
            ]"
          >
            목록형
          </button>
        </div>

        <!-- 게시물 표시 개수 변경 버튼 -->
        <div v-if="currentView === 'list'">
          <select v-model="itemsPerPage" @change="updateItemsPerPage" class="per-page-select">
            <option :value="5">5개 표시</option>
            <option :value="10">10개 표시</option>
            <option :value="25">25개 표시</option>
            <option :value="50">50개 표시</option>
          </select>
        </div>
      </div>

      <!-- 카드형 버튼일 때의 게시판 -->
      <div v-if="currentView === 'card'" class="card-list-wrapper">
        <div v-for="post in posts" :key="post.id">
          <div class="post-card" @click="goToPost(post.id)">
            <div class="post-card-header">
              <h3 class="post-card-title">{{ post.title }}</h3>
              <p class="post-card-author">{{ post.name }}</p>
            </div>
            <p class="post-card-date">{{ post.createdAt.toString().slice(0, 19) }}</p>
          </div>
        </div>
      </div>

      <!-- 리스트형 버튼일 때의 게시판 -->
      <div v-if="currentView === 'list'" class="list-table-wrapper">
        <table class="board-table">
          <!-- post의 머릿글 -->
          <thead class="table-header-row">
            <tr>
              <th scope="col" class="table-header-th w-12"></th>
              <th scope="col" class="table-header-th w-50 !text-left">제목</th>
              <th scope="col" class="table-header-th w-full"></th>
              <th scope="col" class="table-header-th w-24">작성자</th>
              <th scope="col" class="table-header-th w-32">작성일</th>
              <th scope="col" class="table-header-th w-24">조회수</th>
              <th scope="col" class="table-header-th w-24">좋아요</th>
            </tr>
          </thead>

          <!-- post -->
          <tbody class="table-body-row">
            <tr
              v-for="post in posts"
              :key="post.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="goToPost(post.id)"
            >
              <td class="table-data-cell text-left font-medium text-center">
                {{ post.id }}
              </td>
              <td class="table-data-cell text-left font-medium truncate !text-left">
                {{ post.title }}
              </td>
              <td class="table-data-cell"></td>
              <td class="table-data-cell text-right">{{ post.name }}</td>
              <td class="table-data-cell text-right">
                {{ post.createdAt.toString().slice(0, 10) }}
              </td>
              <td class="table-data-cell text-right">{{ post.viewsCount || 0 }}</td>
              <td class="table-data-cell text-right">{{ post.likesCount || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Floating button -->
    <div>
      <button @click="openModal" class="floating-action-button">+</button>
    </div>

    <!-- Modal -->
    <div class="modal-backdrop" v-show="isModalOpen">
      <div class="modal-overlay" @click="isModalOpen = false"></div>

      <form @submit.prevent="submitPost" class="modal-form-box">
        <h3 class="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">게시물 작성</h3>

        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1"> 이름 </label>

          <input
            type="text"
            id="name"
            name="name"
            placeholder="작성자 이름을 입력하세요"
            class="input-text-field"
            v-model="name"
          />
        </div>

        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1"> 제목 </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="제목을 입력하세요"
            class="input-text-field"
            v-model="title"
            required
          />
        </div>

        <div class="mb-6">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1"> 내용 </label>
          <textarea
            id="content"
            name="content"
            rows="5"
            placeholder="자세한 내용을 입력하세요"
            class="input-text-field"
            v-model="content"
            required
          ></textarea>
        </div>

        <button
          @click="isModalOpen = false"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <div class="flex justify-end space-x-3">
          <button
            @click="isModalOpen = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
          >
            취소
          </button>
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            게시
          </button>
        </div>
      </form>
    </div>

    <!-- 페이징 버튼 -->
    <div class="pagination-fixed-wrapper">
      <div class="pagination-button-group">
        <!-- 이전 페이지 버튼 -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-nav-button"
          :class="{
            'bg-indigo-500 text-white hover:bg-indigo-600': currentPage !== 1,
            'bg-gray-300 text-gray-500 cursor-not-allowed': currentPage === 1,
          }"
        >
          &lt; 이전 페이지
        </button>

        <!-- 페이지 인풋 -->
        <div class="pagination-status-box">
          <input
            class="pagination-page-input"
            v-model.number="inputPage"
            @keyup.enter="goToPage(Number(inputPage))"
            :min="1"
            :max="lastPage"
          />
          <span class="text-gray-500">/</span>
          <span class="text-gray-700">{{ lastPage }}</span>
        </div>

        <!-- 다음 페이지 버튼 -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === lastPage"
          class="pagination-nav-button"
          :class="{
            'bg-indigo-500 text-white hover:bg-indigo-600': currentPage !== lastPage,
            'bg-gray-300 text-gray-500 cursor-not-allowed': currentPage === lastPage,
          }"
        >
          다음 페이지 &gt;
        </button>
      </div>
    </div>
  </div>
</template>