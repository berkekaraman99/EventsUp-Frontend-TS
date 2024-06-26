<template>
  <div class="container-fluid">
    <h1 class="fw-bold text-center fs-2 py-2">Topluluk Oluştur</h1>
    <div class="row">
      <FormKit type="form" submit-label="Create" @submit="submitCommunity" :actions="false">
        <FormKit
          type="multi-step"
          tab-style="progress"
          valid-step-icon="star"
          :hide-progress-labels="true"
          :allow-incomplete="false"
          :classes="{
            outer: 'mx-auto',
            wrapper: 'mx-auto',
            steps: 'border-0 rounded-4 bg-white'
          }"
        >
          <FormKit type="step">
            <FormKit
              type="text"
              label="Topluluk Adı"
              validation="required"
              v-model="communityObject.Title"
            />
            <FormKit
              type="textarea"
              label="Topluluk Açıklaması"
              validation="required"
              v-model="communityObject.Description"
            />
            <FormKit
              type="number"
              label="Üye Sayısı Limit"
              value="1"
              step="1"
              min="1"
              v-model="communityObject.ParticipiantLimit"
            />
            <FormKit
              type="select"
              label="Topluluk Konumunu Seçiniz"
              name="planet"
              v-model="communityObject.Location"
            >
              <optgroup
                class="group-header"
                v-for="location in locationInfo"
                :key="location.plaka_kodu"
                :label="location.il_adi"
              >
                <option
                  class="group-text"
                  v-for="ilce in location.ilceler"
                  :key="ilce.ilce_kodu"
                  :value="location.il_adi + ' - ' + changeLetterToLowercase(ilce.ilce_adi)"
                >
                  {{ changeLetterToLowercase(ilce.ilce_adi) }}
                </option>
              </optgroup>
            </FormKit>
            <FormKit
              type="text"
              placeholder="Konum"
              validation="required"
              v-model="communityObject.Location"
              disabled
            />
          </FormKit>

          <FormKit type="step">
            <FormKit
              type="file"
              label="Kapak Resmi"
              accept=".png,.jpg,.jpeg"
              multiple="false"
              validation="required"
              v-on:change="onFileChangeCoverImage"
            />
            <div class="d-flex align-items-center justify-content-center" v-if="coverPreview">
              <img :src="coverPreview" alt="cover preview" class="cover-preview" />
            </div>

            <FormKit
              type="file"
              label="Afiş Resmi"
              accept=".png,.jpg,.jpeg,.gif"
              multiple="false"
              validation="required"
              v-on:change="onFileChangeBannerImage"
            />
            <div class="d-flex align-items-center justify-content center" v-if="bannerPreview">
              <img :src="bannerPreview" alt="cover preview" class="banner-preview" />
            </div>

            <FormKit
              type="select"
              label="Topluluk Halka Açık mı?"
              placeholder="Select..."
              :options="[
                { label: 'Evet', value: true },
                { label: 'Hayır', value: false }
              ]"
              validation="required"
              v-model="communityObject.IsPublic"
            />

            <FormKit
              type="select"
              label="Topluluk Görünür mü?"
              placeholder="Select..."
              :options="[
                { label: 'Evet', value: true },
                { label: 'Hayır', value: false }
              ]"
              validation="required"
              v-model="communityObject.IsVisible"
            />
          </FormKit>
        </FormKit>
        <FormKit
          type="submit"
          :label="loading ? 'Oluşturuluyor' : statusCode !== 200 ? 'Topluluğu Oluştur' : 'Başarılı'"
          wrapper-class="mx-auto text-center"
          :classes="{ input: 'w-100 rounded-5' }"
          :disabled="loading || statusCode === 200"
        />
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
import location from '@/data/location-data.json'
import { reactive, ref, onBeforeUnmount } from 'vue'
import type { ICreateCommunityModel } from '../../models/create_community_model'
import router from '@/router'
import { storeToRefs } from 'pinia'
import { useCommunityStore } from '@/stores/community'
import type { ILocation } from '@/models/location_model'

const locationInfo: Array<ILocation> = location.data

const communityStore = useCommunityStore()
const { _statusCode: statusCode } = storeToRefs(communityStore)

const loading = ref(false)
const changeLoadingState = () => {
  loading.value = !loading.value
}

const communityObject = reactive({
  Location: '',
  IsVisible: true,
  IsPublic: true,
  CoverImage: undefined,
  ParticipiantLimit: '1',
  Description: '',
  Title: '',
  BannerImage: undefined
})

const coverPreview = ref<any>(undefined)
const bannerPreview = ref<any>(undefined)

const onFileChangeCoverImage = (e: any) => {
  let files = e.target.files[0] || e.dataTransfer.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    coverPreview.value = e.target?.result
  }
  reader.readAsDataURL(files)
  communityObject.CoverImage = files
}

const onFileChangeBannerImage = (e: any) => {
  let files = e.target.files[0] || e.dataTransfer.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    bannerPreview.value = e.target?.result
  }
  reader.readAsDataURL(files)
  communityObject.BannerImage = files
}

const submitCommunity = async () => {
  const cObject: ICreateCommunityModel = {
    title: communityObject.Title,
    Description: communityObject.Description,
    ParticipiantLimit: communityObject.ParticipiantLimit,
    Location: communityObject.Location,
    CoverImage: communityObject.CoverImage!,
    IsVisible: communityObject.IsVisible,
    IsPublic: communityObject.IsPublic,
    BannerImage: communityObject.BannerImage!
  }
  console.log(communityObject)

  const body = new FormData()
  body.append('Title', cObject.title)
  body.append('Description', cObject.Description)
  body.append('ParticipiantLimit', cObject.ParticipiantLimit)
  body.append('Location', cObject.Location)
  body.append('CoverImage', cObject.CoverImage)
  body.append('IsVisible', String(cObject.IsVisible))
  body.append('IsPublic', String(cObject.IsPublic))
  body.append('bannerImage', cObject.BannerImage)

  try {
    changeLoadingState()
    await communityStore.createCommunity(body).then(() => {
      changeLoadingState()
      setTimeout(() => {
        communityStore.$patch({
          statusCode: 0
        })
        router.push({ name: 'communities' })
      }, 3000)
    })
  } catch (error: any) {
    changeLoadingState()
    console.log(error.message)
  }
}

const changeLetterToLowercase = (item: string) => {
  let changedItem: string = item[0]
  for (let index = 1; index < item.length; index++) {
    changedItem += item[index].toLowerCase()
  }
  return changedItem
}

onBeforeUnmount(() => {
  communityStore.$patch({
    statusCode: 0
  })
})
</script>

<style scoped>
div .row {
  min-width: 300px;
}

.group-header {
  color: var(--color-primary);
}

.group-text {
  font-weight: 300;
}

.cover-preview {
  object-fit: contain;
  height: 200px;
  border-radius: 1rem;
  margin: 1rem 0px;
}

.banner-preview {
  object-fit: contain;
  height: 200px;
  border-radius: 1rem;
  margin: 1rem 0px;
}
</style>
