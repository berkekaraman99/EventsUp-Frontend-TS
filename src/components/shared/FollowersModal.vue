<template>
  <div
    class="modal fade"
    id="followers"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="followersLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="followersLabel">Takipçiler</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- <LoadingSpinner v-if="loading" /> -->
          <TheLoading v-if="loading" />
          <div v-else-if="followers.length > 0">
            <div class="container">
              <div class="col-12">
                <input
                  type="text"
                  class="form-control form-control-lg mb-3"
                  :placeholder="user ? 'Takip ettiklerini ara' : 'Please login to search'"
                  v-model="search"
                  @keydown.enter="handleSearch"
                  :disabled="!user"
                />
              </div>
            </div>
            <ul class="container" v-if="followers.length > 0">
              <li
                class="card shadow-sm px-4 py-3 my-4"
                v-for="user in followers"
                v-bind:key="user.id"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <div
                      :style="{
                        'background-image': `url(${user.profileImage})`
                      }"
                      alt="profile image"
                      class="post-profile-image me-4"
                      v-if="user.profileImage != null"
                    ></div>
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
                    <div>
                      <RouterLink
                        :to="{ name: 'userprofile', params: { id: user.id } }"
                        class="text-decoration-none"
                      >
                        <div class="fw-bold text-body" data-bs-dismiss="modal">
                          {{ user.fullName }}
                        </div>
                      </RouterLink>
                      <div class="text-secondary">@{{ user.userName }}</div>
                    </div>
                  </div>
                  <button
                    class="btn btn-danger"
                    @click="removeFollower(user.id)"
                    v-if="authUser.id === id"
                  >
                    Kaldır
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="text-center">
            <h4 class="fw-light">Hiç takipçin yok</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
// import LoadingSpinner from "@/components/shared/TheLoading.vue";
import { useAuthStore } from '@/stores/auth'
import { reactive, ref, toRef } from 'vue'
import TheLoading from './TheLoading.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['decrementFollowerCount'])

const userStore = useUserStore()
const { _currentUser: user } = storeToRefs(userStore)

const authStore = useAuthStore()
const { _user: authUser } = storeToRefs(authStore)

const loading = ref(true)
const changeloading = () => {
  loading.value = false
}

const search = ref<string>('')

const handleSearch = async () => {
  loading.value = true
  if (search.value.length > 0) {
    await userStore
      .getUserFollowers(user.value.id, search.value)
      .then(() => (loading.value = false))
  } else {
    // userStore.$patch({
    //   searchedUserFollowers: userStore.userFollowers
    // })
    loading.value = false
  }
}

userStore.getUserFollowers(props.id, '').then(changeloading)
const { _userFollowers: followers, _statusCode: statusCode } = storeToRefs(userStore)

const removeFollower = async (id: string) => {
  await userStore.removeUserFromFollowers(id).then(() => {
    if (statusCode.value === 200) {
      emit('decrementFollowerCount')
    }
  })
}
</script>
