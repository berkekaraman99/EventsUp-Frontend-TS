<template>
  <Transition name="scaleInOut" mode="out-in">
    <LoadingSpinner v-if="loading" />
    <div class="container my-3" v-else-if="post">
      <div class="row">
        <div class="col-12 col-sm-12 col-md-12 col-lg-6 my-4 px-0 px-sm-2">
          <div class="card rounded-4 shadow-sm overflow-hidden">
            <div class="card-header py-3">
              <div class="d-flex justify-content-between">
                <div class="d-flex align-items-center">
                  <div
                    class="post-profile-image"
                    v-if="post.user.profileImage != null"
                    :style="{
                      'background-image': 'url(' + post.user.profileImage + ')',
                      'background-color': 'grey'
                    }"
                  ></div>
                  <div class="mx-3">
                    <div class="fw-bold">{{ post.user.fullName }}</div>
                    <small>
                      @{{ post.user.userName }} -
                      {{ formatTime(post.createdAt) }}
                    </small>
                  </div>
                </div>
                <!-- <div v-if="post.user.id != user.id">
                  <button class="btn follow px-4 fw-light">
                    {{ post.isUserFollowing ? null : 'Follow User' }}
                  </button>
                </div> -->
              </div>
            </div>

            <div class="card-body p-0">
              <div class="my-4 px-3">
                <p>{{ post.description }}</p>
              </div>
              <div :id="`carousel${post.id}`" class="carousel slide" v-if="post.files.length">
                <div class="carousel-inner">
                  <div
                    class="carousel-item"
                    :class="{ active: post.files[0] === file }"
                    v-for="file in post.files"
                    :key="file.file"
                  >
                    <img
                      v-if="file.type === 1 || file.type === 0"
                      :src="file.file"
                      class="d-block w-100 img-fluid"
                      alt="image"
                      style="transition: 0.1s"
                    />
                    <video
                      controls
                      v-else-if="file.type === 2"
                      :src="file.file"
                      class="d-block w-100"
                    ></video>
                  </div>
                </div>
                <button
                  class="carousel-control-prev position-absolute top-50 start-0 translate-middle-y"
                  type="button"
                  :data-bs-target="`#carousel${post.id}`"
                  data-bs-slide="prev"
                  v-if="post.files.length !== 1"
                >
                  <i class="fa-solid fa-circle-chevron-left fa-lg"></i>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button
                  class="carousel-control-next position-absolute top-50 end-0 translate-middle-y"
                  type="button"
                  :data-bs-target="`#carousel${post.id}`"
                  data-bs-slide="next"
                  v-if="post.files.length !== 1"
                >
                  <i class="fa-solid fa-circle-chevron-right fa-lg"></i>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>

            <div class="card-footer px-0">
              <div
                id="interactionPreviews"
                class="container"
                v-if="post.interactionPreviews != null"
              >
                <span
                  v-for="interactionPreview in post.interactionPreviews"
                  :key="interactionPreview.interaction"
                >
                  <span v-if="interactionPreview.interaction === 0"
                    ><img src="@/assets/images/interactions/ic_like.png" alt="Like" height="32" />
                  </span>
                  <span v-if="interactionPreview.interaction === 1"
                    ><img
                      src="@/assets/images/interactions/ic_celebrate.png"
                      alt="Celebrate"
                      height="32"
                    />
                  </span>
                  <span v-if="interactionPreview.interaction === 2"
                    ><img
                      src="@/assets/images/interactions/ic_support.png"
                      alt="Support"
                      height="32"
                    />
                  </span>
                  <span v-if="interactionPreview.interaction === 3"
                    ><img
                      src="@/assets/images/interactions/ic_insight.png"
                      alt="Insightfull"
                      height="32"
                    />
                  </span>
                  <span v-if="interactionPreview.interaction === 4"
                    ><img
                      src="@/assets/images/interactions/ic_dislike.png"
                      alt="Dislike"
                      height="32"
                    />
                  </span>
                </span>
                <span v-if="post.interactionCount === 1" class="ms-2">
                  {{ post.interactionCount }} İfade
                </span>
                <span v-else-if="post.interactionCount !== 0" class="ms-2">
                  {{ post.interactionCount }} İfade
                </span>
              </div>
              <div class="container">
                <PostActions :post="post" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-12 col-md-12 col-lg-6 my-4 px-0 px-sm-2">
          <div class="card rounded-4 shadow-sm overflow-hidden">
            <div class="card-header"><h1>Yorumunuz</h1></div>
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div v-if="user.profileImage != null">
                  <div
                    class="post-profile-image me-3 shadow-sm"
                    :style="{
                      'background-image': `url(${user.profileImage})`
                    }"
                  ></div>
                </div>
                <img
                  src="@/assets/images/profile-man.png"
                  alt="profile-man"
                  class="post-profile-image me-4"
                  v-else-if="user.gender == 2"
                />
                <img
                  src="@/assets/images/profile-woman.png"
                  alt="profile-woman"
                  class="post-profile-image me-4"
                  v-else-if="user.gender == 1"
                />
                <img
                  src="@/assets/images/user.png"
                  alt="profile"
                  class="post-profile-image me-4"
                  v-else
                />
                <textarea
                  class="form-control rounded-3 px-2"
                  id="message"
                  rows="4"
                  placeholder="Your message"
                  v-model="message"
                ></textarea>
              </div>
              <div class="d-flex justify-content-end">
                <FormKit
                  type="button"
                  :label="
                    isPosting ? 'Gönderiliyor' : statusCode !== 200 ? 'Yorum Yap' : 'Başarılı'
                  "
                  wrapper-class="mx-auto text-center"
                  @click="createComment"
                  :disabled="message.length === 0 || isPosting || statusCode === 200"
                />
              </div>
            </div>
          </div>
          <h4 class="col-12 mt-4 mx-3">Yorumlar</h4>

          <div>
            <TransitionGroup
              appear
              @before-enter="beforeEnterFeed"
              @enter="enterFeed"
              @before-leave="beforeLeaveFeed"
              @leave="leaveFeed"
            >
              <div
                class="my-2"
                v-for="(comment, index) in comments"
                v-bind:key="comment.id"
                :data-index="index"
              >
                <CommentVue
                  :comment="comment"
                  :user-id="user.id"
                  :post-id="post.id"
                  @delete-comment="deleteComment"
                />
              </div>
            </TransitionGroup>
          </div>
          <div class="text-center fw-light fs-4 my-3" v-if="comments.length === 0">
            Yorum bulunamadı
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import moment from 'moment'
import LoadingSpinner from '@/components/shared/TheLoading.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { usePostStore } from '@/stores/post'
import CommentVue from '@/components/shared/CommentVue.vue'
import PostActions from '@/components/shared/PostActions.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const beforeEnterFeed: any = (el: HTMLElement) => {
  el.style.opacity = '0'
  el.style.transform = 'translateY(100px)'
}
const enterFeed: any = (el: HTMLElement) => {
  const index = el.dataset.index ? parseInt(el.dataset.index) : 0
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: 0.1 * index
  })
}
const beforeLeaveFeed: any = (el: HTMLElement) => {
  el.style.opacity = '1'
}
const leaveFeed: any = (el: HTMLElement) => {
  const index = el.dataset.index ? parseInt(el.dataset.index) : 0
  gsap.to(el, {
    opacity: 0,
    y: 100,
    duration: 0.6,
    delay: 0.1 * index
  })
}
const loading = ref(true)
const changeLoadingState = () => {
  loading.value = !loading.value
}

const authStore = useAuthStore()
const { _user: user } = storeToRefs(authStore)
const message = ref('')

const postStore = usePostStore()
postStore.getPostById(props.id).then(changeLoadingState)
postStore.getPostComments(props.id)

const formatTime = (time: any) => {
  return moment(time).fromNow()
}

const { _statusCode: statusCode } = storeToRefs(postStore)

const isPosting = ref(false)
const changePostingState = () => {
  isPosting.value = !isPosting.value
}

const createComment = async () => {
  changePostingState()
  await postStore
    .createComment({
      postId: props.id,
      parentCommentId: '',
      message: message.value
    })
    .then(async () => {
      changePostingState()
      await postStore.getPostComments(props.id)
      setTimeout(() => {
        postStore.$patch({
          statusCode: 0
        })
      }, 2000)
    })
  message.value = ''
}
const deleteComment = async (commentId: string, postId: string) => {
  await postStore.deleteComment({ commentId, postId })
}

const { _post: post, _postComments: comments } = storeToRefs(postStore)

onBeforeUnmount(() => {
  postStore.$patch({
    post: {},
    postComments: []
  })
})
</script>

<style scoped lang="scss">
.delete {
  cursor: pointer;
}

.horizontal {
  border: 1px solid var(--color-primary);

  &.dropdown-menu.show {
    display: flex;
  }
}

#message {
  width: 100%;
  box-sizing: border-box;
  direction: ltr;
  display: block;
  max-width: 100%;
  line-height: 1.5;
  letter-spacing: 1px;
  padding: 15px 15px 30px;
  border-radius: 3px;
  border: 1px solid grey;
  font:
    13px Tahoma,
    cursive;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: var(--color-primary);
  }
}

.follow {
  background-color: #24a0ed;
  color: white;
  border-radius: 99px;
}

.follow:hover {
  background-color: #1b74ac;
}
</style>
