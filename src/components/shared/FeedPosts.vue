<template>
  <div class="col-12 my-4 px-0 px-sm-2" style="min-width: 359px">
    <div class="card rounded-4 shadow-sm overflow-hidden">
      <div class="card-header py-3">
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-center">
            <img
              v-if="post.user.profileImage != null"
              class="post-profile-image"
              :src="post.user.profileImage"
            />
            <img
              src="@/assets/images/profile-man.png"
              alt="profile-man"
              class="post-profile-image"
              v-else-if="post.user.gender == 2"
            />
            <img
              src="@/assets/images/profile-woman.png"
              alt="profile-woman"
              class="post-profile-image"
              v-else-if="post.user.gender == 1"
            />
            <img src="@/assets/images/user.png" alt="profile" class="post-profile-image" v-else />
            <div class="mx-3">
              <RouterLink
                :to="{ name: 'userprofile', params: { id: post.user.id } }"
                class="text-decoration-none"
              >
                <div class="fw-bold">{{ post.user.fullName }}</div>
              </RouterLink>
              <small>
                @{{ post.user.userName }} -
                {{ formatTime(post.createdAt) }}
              </small>
            </div>
          </div>
          <div class="dropdown">
            <i
              class="fa-solid fa-ellipsis fa-2xl"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></i>
            <ul class="dropdown-menu dropdown-menu-end">
              <li class="dropdown-item">
                <button class="btn w-100 text-danger">
                  <i class="fa-regular fa-flag"></i> {{ t('feed.reportpost') }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="my-4 px-1">
          <p>{{ post.description }}</p>
        </div>
        <div :id="`carousel${post.id}`" class="carousel slide" v-if="post.files.length">
          <div class="carousel-inner">
            <div
              class="carousel-item overflow-hidden rounded-3"
              :class="{ active: post.files[0] === file }"
              style="transition: 0.35s ease-in-out; max-height: 400px"
              v-for="file in post.files"
              :key="file.file"
            >
              <img
                v-if="file.type === 1 || file.type === 0"
                :src="file.file"
                class="d-block img-fluid w-100 object-fit-contain"
                style="height: 400px"
                alt="image"
              />
              <video
                height="400"
                controls
                v-else-if="file.type === 2"
                :src="file.file"
                class="d-block mx-auto w-100"
                preload="none"
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
            <i class="fa-solid fa-circle-chevron-left fa-lg text-body"></i>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next position-absolute top-50 end-0 translate-middle-y"
            type="button"
            :data-bs-target="`#carousel${post.id}`"
            data-bs-slide="next"
            v-if="post.files.length !== 1"
          >
            <i class="fa-solid fa-circle-chevron-right fa-lg text-body"></i>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div class="card-footer px-0">
        <div id="interactionPreviews" class="container" v-if="post.interactionPreviews != null">
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
              ><img src="@/assets/images/interactions/ic_support.png" alt="Support" height="32" />
            </span>
            <span v-if="interactionPreview.interaction === 3"
              ><img
                src="@/assets/images/interactions/ic_insight.png"
                alt="Insightfull"
                height="32"
              />
            </span>
            <span v-if="interactionPreview.interaction === 4"
              ><img src="@/assets/images/interactions/ic_dislike.png" alt="Dislike" height="32" />
            </span>
          </span>
          <span v-if="post.interactionCount === 1" class="ms-2">
            {{ post.interactionCount }} {{ t('feed.expression') }}
          </span>
          <span v-else-if="post.interactionCount > 1" class="ms-2">
            {{ post.interactionCount }} {{ t('feed.expression') }}
          </span>
        </div>
        <div class="container">
          <PostActions :post="props.post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import PostActions from './PostActions.vue'
import type { PropType } from 'vue'
import type { IFeedPost } from '@/models/feed_post_model'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  post: {
    type: Object as PropType<IFeedPost>,
    required: true
  }
})

const formatTime = (time: any) => {
  return moment(time).fromNow()
}
</script>

<style scoped></style>
