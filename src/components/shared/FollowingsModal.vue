<template>
  <div
    class="modal fade"
    id="followings"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="followingsLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-4" id="followingsLabel">Takipler</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <TheLoading v-if="loading" />
          <div v-else>
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
            <ul class="container" v-if="followings.length > 0">
              <li
                class="card shadow-sm px-4 py-3 my-4"
                v-for="user in followings"
                v-bind:key="user.id"
              >
                <RouterLink
                  :to="{ name: 'userprofile', params: { id: user.id } }"
                  class="text-decoration-none"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                    data-bs-dismiss="modal"
                  >
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
                        <div class="fw-bold text-body">
                          {{ user.fullName }}
                        </div>
                        <div class="text-secondary">@{{ user.userName }}</div>
                      </div>
                    </div>
                  </div>
                </RouterLink>
              </li>
            </ul>
            <div v-else class="text-center">
              <h4 class="fw-light">Takip ettiğin kimse yok</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { reactive, ref, toRef } from 'vue'
import TheLoading from './TheLoading.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const userStore = useUserStore()
const { _currentUser: user } = storeToRefs(userStore)

const loading = ref(true)
const changeloading = () => {
  loading.value = false
}

const search = ref<string>('')

const handleSearch = async () => {
  loading.value = true
  if (search.value.length > 0) {
    await userStore
      .getUserFollowings(user.value.id, search.value)
      .then(() => (loading.value = false))
  } else {
    // userStore.$patch({
    //   searchedUserFollowings: userStore.userFollowings
    // })
    loading.value = false
  }
}

userStore.getUserFollowings(props.id, '').then(changeloading)

const { _userFollowings: followings } = storeToRefs(userStore)
</script>

<style scoped></style>
