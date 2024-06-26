<template>
  <RouterLink :to="eventLink" class="text-decoration-none text-bg-primary">
    <div class="container bg-body event mb-5 shadow-sm rounded-3">
      <div class="row">
        <div class="col-sm-12 col-md-4 d-grid align-content-center">
          <img
            :src="userEvent.images[0]"
            alt="event cover"
            class="p-2 img-fluid rounded-4 my-3"
            v-if="userEvent.images.length !== 0"
          />
          <img
            class="p-2 my-3 rounded-4 img-fluid"
            src="https://picsum.photos/400"
            alt="event-image"
            v-else
          />
        </div>

        <div class="col-sm-12 col-md-8 col-lg-6 d-flex justify-content-between">
          <div class="d-flex flex-column justify-content-between rounded-4 m-2 p-2">
            <div>
              <h3 class="fw-bold my-2">{{ userEvent.title }}</h3>
            </div>
            <div>
              <div>
                <p class="card-text my-4">
                  <span>
                    <i class="fa-solid fa-calendar-days"></i>
                    {{ formatTime(userEvent.startDate) }}
                  </span>
                  -
                  <span>
                    {{ formatTime(userEvent.endDate) }}
                  </span>
                </p>
                <p class="card-text my-4">
                  <i class="fa-solid fa-location-dot fa-lg"></i>
                  {{ userEvent.location != null ? userEvent.location : 'Not Available' }}
                </p>
                <p class="card-text pt-2">
                  <i class="fa-solid fa-users fa-lg"></i>
                  {{ userEvent.attendeesCount }}
                  {{ t('event.attendsgoing') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { IEventPreview } from '@/models/event_preview_model'
import type { PropType } from 'vue'
import moment from 'moment'

import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps({
  userEvent: {
    type: Object as PropType<IEventPreview>,
    required: true
  }
})

const eventLink = computed(() => {
  return {
    name: 'eventdetails',
    params: { id: props.userEvent.id }
  }
})

const formatTime = (time: any) => {
  return moment(time).format('DD MMMM YYYY, hh:mm')
}
</script>

<style scoped lang="scss">
.event {
  border-radius: 0.5rem;
  max-width: 880px;
  max-height: 300px;

  @media (max-width: 768px) {
    max-height: fit-content;
  }
}
</style>
