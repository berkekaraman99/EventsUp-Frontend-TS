<template>
  <div class="container-fluid">
    <div class="container-md">
      <div class="row">
        <div class="col-12 mt-3" v-if="loading">
          <div class="profile-header position-relative placeholder-glow">
            <div class="profile-banner rounded-4 placeholder"></div>
            <div class="profile-image placeholder bg-black"></div>
            <div class="profile-details">
              <div class="col-4">
                <h2 class="fw-bold">
                  <span class="placeholder col-12"></span>
                </h2>
                <h5 class="placeholder col-8"></h5>
                <div>
                  <span class="placeholder h3 col-3 me-1"></span>
                  <span class="placeholder h3 col-3 me-1"></span>
                  <span class="placeholder h3 col-3"></span>
                  <p class="placeholder col-12 h3"></p>
                </div>
              </div>
              <div class="align-self-baseline">
                <a class="btn follow placeholder" style="width: 100px" disabled></a>
              </div>
            </div>
          </div>

          <div id="options" class="container my-4">
            <div class="row">
              <div class="col-sm-12 col-md-3 text-center my-2">
                <span class="placeholder col-6 h2"></span>
              </div>

              <div class="col-sm-12 col-md-3 text-center my-2">
                <span class="placeholder col-6 h2"></span>
              </div>

              <div class="col-sm-12 col-md-3 text-center my-2">
                <span class="placeholder col-6 h2"></span>
              </div>

              <div class="col-sm-12 col-md-3 text-center my-2">
                <span class="placeholder col-6 h2"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 mt-3 mb-sm-0 mb-md-3 mb-lg-0" v-else>
          <div class="profile-header position-relative card rounded-4 shadow-sm">
            <img
              v-if="currentUser.bannerImage != null"
              class="profile-banner rounded-top-4"
              :src="currentUser.bannerImage"
              alt="banner"
            />
            <div v-else class="profile-banner rounded-top-4 bg-secondary"></div>

            <img
              class="profile-image bg-body shadow"
              :src="currentUser.profileImage"
              v-if="currentUser.profileImage != null"
            />
            <img
              src="@/assets/images/profile-man.png"
              alt="profile-man"
              class="profile-image me-4"
              v-else-if="currentUser.gender == 2"
            />
            <img
              src="@/assets/images/profile-woman.png"
              alt="profile-woman"
              class="profile-image me-4"
              v-else-if="currentUser.gender == 1"
            />
            <img src="@/assets/images/user.png" alt="profile" class="profile-image me-4" v-else />
            <div class="profile-details">
              <div>
                <h2 class="fw-bold">{{ currentUser.fullName }}</h2>
                <h5 class="fw-normal">@{{ currentUser.userName }}</h5>
                <div class="d-flex flex-column flex-sm-row">
                  <div
                    class="me-3 pointer"
                    :data-bs-toggle="
                      (!currentUser.isFollowing && currentUser.isPrivate) || currentUser.isBlocked
                        ? null
                        : 'modal'
                    "
                    data-bs-target="#followers"
                    @click="
                      (!currentUser.isFollowing && currentUser.isPrivate) || currentUser.isBlocked
                        ? null
                        : getFollowers()
                    "
                  >
                    <h3 class="fw-bold d-inline-block">
                      {{ currentUser.isBlocked ? '-' : currentUser.followersCount }}
                    </h3>
                    {{ t('profile.followers') }}
                  </div>

                  <div
                    class="me-3 pointer"
                    :data-bs-toggle="
                      (!currentUser.isFollowing && currentUser.isPrivate) || currentUser.isBlocked
                        ? null
                        : 'modal'
                    "
                    data-bs-target="#followings"
                    @click="
                      (!currentUser.isFollowing && currentUser.isPrivate) || currentUser.isBlocked
                        ? null
                        : getFollowings()
                    "
                  >
                    <h3 class="fw-bold d-inline-block">
                      {{ currentUser.isBlocked ? '-' : currentUser.followingCount }}
                    </h3>
                    {{ t('profile.followings') }}
                  </div>
                </div>
                <!-- Bio -->
                <p v-if="!currentUser.isPrivate || currentUser.isFollowing" class="my-3">
                  {{ currentUser.bio }}
                </p>
              </div>
              <div
                class="d-flex justify-content-center align-items-end align-items-sm-center align-self-baseline flex-column-reverse flex-sm-row"
              >
                <button
                  class="btn follow px-4 fw-light"
                  @click="removeFollowRequest(currentUser)"
                  v-if="currentUser.isFollowRequestSent"
                >
                  {{ t('profile.unfollowrequest') }}
                </button>
                <button
                  class="btn follow px-sm-4 fw-light tw-text-sm"
                  @click="followUser(currentUser)"
                  v-else-if="
                    currentUser.id !== user.id && !currentUser.isFollowing && !currentUser.isBlocked
                  "
                >
                  {{ t('profile.follow') }}
                </button>
                <div class="d-flex align-items-center pointer ms-3">
                  <div class="dropdown">
                    <i
                      class="fa-solid fa-ellipsis fa-2xl"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></i>
                    <ul class="dropdown-menu">
                      <li
                        class="dropdown-item"
                        @click="blockUser(currentUser)"
                        v-if="!currentUser.isBlocked"
                      >
                        <button class="btn w-100 text-danger">
                          <img src="@/assets/images/ic_block.png" alt="block" height="21" />
                          {{ t('profile.block') }}
                        </button>
                      </li>
                      <li class="dropdown-item" @click="unblockUser(currentUser)" v-else>
                        <button class="btn w-100 text-danger">
                          <img src="@/assets/images/ic_block.png" alt="block" height="21" />
                          {{ t('profile.unblock') }}
                        </button>
                      </li>
                      <li
                        class="dropdown-item text-warning-emphasis"
                        v-if="currentUser.isFollowing"
                        @click="unfollowUser(currentUser)"
                      >
                        <button class="btn w-100 text-warning-emphasis">
                          {{ t('profile.unfollow') }}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Followers Modal -->
          <FollowersModal :id="id" />

          <!-- Followings Modal -->
          <FollowingsModal :id="id" />
        </div>
      </div>
    </div>
    <div v-if="loading"></div>
    <div class="mt-3 mx-3 fs-5" v-else-if="currentUser.isBlocked">
      <p class="fw-light text-center">{{ t('profile.blockeduser') }}</p>
    </div>
    <div id="options" class="w-100" v-else-if="!currentUser.isPrivate || currentUser.isFollowing">
      <div class="card shadow-sm flex-column flex-sm-column flex-md-row">
        <div class="text-center my-2">
          <input
            type="radio"
            name="group-radio"
            id="radio-1"
            class="radio"
            value="radio1"
            :checked="component === 'activities'"
          />
          <label for="radio-1">
            <span
              class="fw-bold fs-5 category"
              :class="{ selected: component === 'activities' }"
              id="activities"
              @click="changeComponent('activities')"
              >{{ t('profile.activities') }}</span
            >
          </label>
        </div>

        <div class="text-center my-2">
          <input
            type="radio"
            name="group-radio"
            id="radio-2"
            class="radio"
            value="radio2"
            :checked="component === 'UserPosts'"
          />
          <label for="radio-2">
            <span
              class="fw-bold fs-5 category"
              :class="{ selected: component === 'UserPosts' }"
              id="posts"
              @click="changeComponent('UserPosts')"
              >{{ t('profile.posts') }}</span
            >
          </label>
        </div>

        <div class="text-center my-2">
          <input
            type="radio"
            name="group-radio"
            id="radio-3"
            class="radio"
            value="radio3"
            :checked="component === 'UserEvents'"
          />
          <label for="radio-3">
            <span
              class="fw-bold fs-5 category"
              :class="{ selected: component === 'UserEvents' }"
              id="events"
              @click="changeComponent('UserEvents')"
              >{{ t('profile.events') }}</span
            >
          </label>
        </div>

        <div class="text-center my-2">
          <input
            type="radio"
            name="group-radio"
            id="radio-4"
            class="radio"
            value="radio4"
            :checked="component === 'UserCommunities'"
          />
          <label for="radio-4">
            <span
              class="fw-bold fs-5 category"
              :class="{ selected: component === 'UserCommunities' }"
              id="communities"
              @click="changeComponent('UserCommunities')"
              >{{ t('profile.communities') }}</span
            >
          </label>
        </div>
      </div>
    </div>

    <div class="mt-3 mx-3 fs-5" v-else>
      <p class="fw-light">{{ t('profile.profileisprivate') }}</p>
      <p class="fw-light">
        {{ t('profile.profileisprivatedescription') }}
      </p>
    </div>
    <div v-if="!currentUser.isPrivate || currentUser.isFollowing">
      <Transition name="scaleInOut" mode="out-in">
        <component :is="component" />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import UserCommunities from '@/components/common/userprofile/UserCommunities.vue'
import UserPosts from '@/components/common/userprofile/UserPosts.vue'
import FollowingsModal from '@/components/shared/FollowingsModal.vue'
import FollowersModal from '@/components/shared/FollowersModal.vue'
import UserEvents from '@/components/common/userprofile/UserEvents.vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import type { IUser } from '@/models/user_model'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    UserCommunities,
    UserPosts,
    UserEvents,
    FollowingsModal,
    FollowersModal
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n()
    const authStore = useAuthStore()
    const { _user: user } = storeToRefs(authStore)
    const userStore = useUserStore()
    const component = ref<string>('UserCommunities')

    const loading = ref(true)
    const changeLoadingState = () => {
      loading.value = !loading.value
    }

    userStore.getUserById(props.id).then(changeLoadingState)
    const { _currentUser: currentUser } = storeToRefs(userStore)

    const changeComponent = (tab: string) => {
      component.value = tab
    }

    const getFollowers = async () => {
      await userStore.getUserFollowers(currentUser.value.id, '')
    }

    const getFollowings = async () => {
      await userStore.getUserFollowings(currentUser.value.id, '')
    }

    const followUser = async (currentUser: IUser) => {
      try {
        await userStore.followUser(currentUser.id).then(() => {
          if (!currentUser.isPrivate) {
            currentUser.isFollowing = true
          } else {
            currentUser.isFollowRequestSent = true
          }
        })
      } catch (error: any) {
        console.log(error.response.data)
      }
    }

    const unfollowUser = async (user: IUser) => {
      try {
        await userStore.unfollowUser(user.id).then(() => (user.isFollowing = false))
      } catch (error: any) {
        console.log(error.response.data)
      }
    }

    const blockUser = async (user: IUser) => {
      const body = new FormData()
      const userId = user.id
      body.append('targetId', userId)
      await userStore.blockUser(body).then(() => (user.isBlocked = true))
    }

    const unblockUser = async (user: IUser) => {
      const body = new FormData()
      const userId = user.id
      body.append('targetId', userId)
      await userStore.unblockUser(body).then(() => (user.isBlocked = false))
    }

    const removeFollowRequest = async (currentUser: IUser) => {
      await userStore
        .removeFollowRequest(currentUser.id)
        .then(() => (currentUser.isFollowRequestSent = false))
    }

    return {
      t,
      user,
      component,
      loading,
      currentUser,
      changeComponent,
      getFollowers,
      getFollowings,
      followUser,
      unfollowUser,
      blockUser,
      unblockUser,
      removeFollowRequest,
      userStore,
      id: user.value.id
    }
  },
  beforeUnmount() {
    this.userStore.$patch({
      currentUser: {}
    })
  }
})
</script>

<style scoped lang="scss">
#options {
  padding: 0px 0.75rem;
  margin: 16px 0px;
  z-index: 9;

  & div {
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-around;

    @media (min-width: 768px) and (max-width: 992px) {
      border-radius: 0px;
    }
  }

  @media (min-width: 768px) and (max-width: 992px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    border-top: 1px solid grey;
  }
}
.profile-details {
  margin: 72px 16px 0px 16px;
  padding: 0.5rem 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-header {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.category {
  transition: 0.3s;
  color: #83818c;
  padding: 20px;
  margin: 0 6px;
  z-index: 1;
  position: relative;
  cursor: pointer;

  &:hover {
    letter-spacing: 1px;
  }
}

.selected {
  transition: 0.3s all ease;
  color: var(--color-primary);
  padding: 20px;
  margin: 0 6px;
  z-index: 2;
  position: relative;
  letter-spacing: 1px;
}

.radio {
  appearance: none;
}
</style>
