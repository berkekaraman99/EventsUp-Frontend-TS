<template>
  <div class="container-fluid">
    <LoadingSpinner v-if="isSettingsLoading" />
    <div class="container" v-else>
      <div class="row">
        <div class="col-12 col-sm-12 col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
          <h1 class="display-5 fw-bold">{{ t('settings.header') }}</h1>
          <h4 class="mb-3 text-primary-emphasis">
            <i class="fa-solid fa-shield-halved"></i>
            {{ t('settings.securityprivacy') }}
          </h4>
          <hr />
          <!-- CHANGE PASSWORD -->
          <div class="my-1">
            <div>
              <div
                class="tile bg-body-secondary"
                data-bs-toggle="collapse"
                data-bs-target="#collapsePassword"
                aria-expanded="false"
                aria-controls="collapsePassword"
              >
                <i class="fa-solid fa-key"></i>
                {{ t('settings.changepassword') }}
              </div>
            </div>
            <ChangePassword />
          </div>

          <!-- DELETE ACCOUNT -->
          <div
            class="tile text-danger bg-body-secondary"
            data-bs-toggle="modal"
            data-bs-target="#offcanvasDeleteMyAccount"
          >
            <i class="fa-solid fa-user-large-slash"></i>
            {{ t('settings.deleteaccount') }}
          </div>

          <DeleteAccount />

          <!-- CHANGE PRIVACY -->
          <div class="my-2 mx-2">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="privateSwitch"
                :checked="userInformation.isPrivate"
                v-on:change="changePrivacy(!userInformation.isPrivate)"
                :disabled="loading"
              />
              <label class="form-check-label" for="privateSwitch">
                <i class="fa-solid fa-user-ninja"></i>
                {{ t('settings.hidemyaccount') }}
              </label>
            </div>
          </div>

          <h4 class="mt-4 mb-3 text-primary-emphasis">
            <i class="fa-solid fa-user-gear"></i> {{ t('settings.general') }}
          </h4>
          <hr />
          <div class="my-1">
            <LocaleChangerVue />
          </div>

          <!-- EDIT PROFILE -->
          <div class="my-1">
            <div>
              <div
                class="tile bg-body-secondary"
                data-bs-toggle="collapse"
                data-bs-target="#collapseEditProfile"
                aria-expanded="false"
                aria-controls="collapseEditProfile"
              >
                <i class="fa-solid fa-user-pen"></i>
                {{ t('settings.editprofileinfo') }}
              </div>
            </div>
            <EditProfile />
          </div>

          <!-- CHANGE PROFILE IMAGE -->
          <div class="my-1">
            <div>
              <div
                class="tile bg-body-secondary"
                data-bs-toggle="collapse"
                data-bs-target="#collapseProfileImage"
                aria-expanded="false"
                aria-controls="collapseProfileImage"
              >
                <i class="fa-solid fa-image-portrait"></i>
                {{ t('settings.changeprofileimage') }}
              </div>
            </div>
            <ChangeProfileImage :id="userId" />
          </div>

          <!-- CHANGE BANNER IMAGE -->
          <div class="my-1">
            <div>
              <div
                class="tile bg-body-secondary"
                data-bs-toggle="collapse"
                data-bs-target="#collapseBannerImage"
                aria-expanded="false"
                aria-controls="collapseBannerImage"
              >
                <i class="fa-solid fa-panorama"></i>
                {{ t('settings.changebannerimage') }}
              </div>
            </div>
            <ChangeBannerImage :id="userId" />
          </div>

          <!-- DARK MODE -->
          <div class="my-2 mx-2">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="darkModeSwitch"
                disabled
              />
              <label class="form-check-label" for="darkModeSwitch">
                <i class="fa-solid fa-circle-half-stroke"></i>
                {{ t('settings.darkmode') }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/shared/TheLoading.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import ChangePassword from '@/components/common/settings/ChangePassword.vue'
import ChangeProfileImage from '@/components/common/settings/ChangeProfileImage.vue'
import ChangeBannerImage from '@/components/common/settings/ChangeBannerImage.vue'
import EditProfile from '@/components/common/settings/EditProfile.vue'
import DeleteAccount from '@/components/common/settings/DeleteAccount.vue'
import LocaleChangerVue from '@/components/common/settings/LocaleChanger.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const authStore = useAuthStore()
const { _user: user } = storeToRefs(authStore)
const userStore = useUserStore()
const userId = user.value.id

const loading = ref(false)
const changeLoadingState = () => {
  loading.value = !loading.value
}

const isSettingsLoading = ref(true)
const changeSettingsLoading = () => {
  isSettingsLoading.value = !isSettingsLoading.value
}

userStore.getUserById(userId.toString()).then(changeSettingsLoading)
const changePrivacy: Function = async (isPrivate: boolean) => {
  changeLoadingState()
  await userStore.changeUserPrivacy({ isPrivate }).then(changeLoadingState)
}

const { _currentUser: userInformation } = storeToRefs(userStore)
</script>

<style scoped lang="scss">
.tile {
  transition: 0.3s ease;
  // border: 1px solid white;
  border-radius: 0.5rem;
  padding: 12px 0.75rem;
  font-weight: bold;
  // background-color: white;
  margin: 0.75rem 0px;

  &:hover {
    transition: 0.3s ease;
    // background-color: rgb(244, 244, 244);
    // border-top: 1px solid lightgrey;
    // border-bottom: 1px solid lightgrey;
  }
}

.formkit-suffix-icon {
  transition: 0.3s ease;

  &:hover {
    color: var(--fk-color-primary);
  }
}
</style>
