<template>
  <Transition
    appear
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div class="container px-0">
      <div class="row">
        <div class="col-12 col-md-12 col-lg-6">
          <div class="card-text d-flex my-3">
            <div class="me-4">
              <div>
                <p class="fw-medium tw-text-lg mb-0">
                  <i class="fa-solid fa-calendar-days"></i>
                  {{ t('event.startDate') }}
                </p>
                <span class="tw-text-sm">
                  {{ formatTime(currentEvent.startDate) }}
                </span>
              </div>
              <div>
                <p class="fw-medium tw-text-lg mb-0 mt-3">
                  <i class="fa-solid fa-calendar-days"></i>
                  {{ t('event.endDate') }}
                </p>
                <span class="tw-text-sm">
                  {{ formatTime(currentEvent.endDate) }}
                </span>
              </div>
            </div>
            <div></div>
          </div>
          <div class="my-4">
            <p class="tw-text-xl my-2 fw-medium">
              {{ t('event.description') }}
            </p>
            <p class="tw-text-sm my-2">
              {{
                currentEvent.description != null
                  ? currentEvent.description
                  : 'Description not available'
              }}
            </p>
          </div>
          <p class="tw-text-sm">
            <i class="fa-solid fa-users fa-lg me-1"></i>
            {{ currentEvent.attendeesCount }} {{ t('event.attendsgoing') }}
          </p>
          <p class="tw-text-sm my-2">
            <i class="fa-solid fa-location-dot fa-lg me-1"></i>
            {{ currentEvent.location != null ? currentEvent.location : 'Not Available' }}
          </p>
        </div>
        <div
          class="col-12 col-md-12 col-lg-6 d-flex align-items-end justify-content-end flex-column"
        >
          <div class="fw-medium text-end">{{ t('event.owner') }}</div>
          <div class="d-flex align-items-center justify-content-end my-3">
            <div class="mx-3">
              {{ currentEvent.user.fullName }}
            </div>
            <img
              v-if="currentEvent.user.profileImage"
              class="post-profile-image"
              :src="currentEvent.user.profileImage"
              alt="profile image"
            />
            <img
              src="@/assets/images/profile-man.png"
              alt="profile-man"
              class="post-profile-image"
              v-else-if="currentEvent.user.gender == 2"
            />
            <img
              src="@/assets/images/profile-woman.png"
              alt="profile-woman"
              class="post-profile-image"
              v-else-if="currentEvent.user.gender == 1"
            />
            <img src="@/assets/images/user.png" alt="profile" class="post-profile-image" v-else />
          </div>
        </div>
        <div
          id="eventAction"
          class="card-footer fw-bold pointer p-0 m-0 mt-3"
          v-if="currentEvent.user.id !== user.id"
        >
          <button class="btn btn-secondary w-100 h-100" v-if="processing" disabled>
            <div class="spinner-border text-info" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
          <button
            class="btn btn-success w-100 h-100"
            v-else-if="!currentEvent.isAttendeed"
            @click="joinEvent(currentEvent)"
          >
            Etkinliğe Katıl
          </button>
          <button
            class="btn btn-danger w-100 h-100"
            v-else-if="currentEvent.user.id !== user.id"
            @click="leaveEvent(currentEvent)"
          >
            Etkinlikten Ayrıl
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEventStore } from '@/stores/event'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const authStore = useAuthStore()
    const eventStore = useEventStore()
    const { _user: user } = storeToRefs(authStore)
    const { _currentEvent: currentEvent } = storeToRefs(eventStore)

    const processing = ref(false)
    const changeProcessing = () => {
      processing.value = !processing.value
    }

    const formatTime = (time: any) => {
      return moment(time).format('DD MMMM YYYY, hh:mm')
    }

    const joinEvent = async (cEvent: any) => {
      changeProcessing()
      await eventStore.joinEvent(currentEvent.value.id).then(() => {
        cEvent.isAttendeed = true
        changeProcessing()
      })
    }

    const leaveEvent = async (cEvent: any) => {
      changeProcessing()
      await eventStore.leaveEvent(currentEvent.value.id).then(() => {
        cEvent.isAttendeed = false
        changeProcessing()
      })
    }

    return {
      t,
      user,
      processing,
      joinEvent,
      leaveEvent,
      formatTime,
      currentEvent
    }
  }
})
</script>

<style scoped></style>
