<script setup lang="ts">
import { h } from 'vue'
import { UiAuthLayout, UiAuthSplit, UiAuthShowcase, UiTextField, UiPasswordInput, UiPhoneInput, UiOptionCards } from '@ziyarago/ui/vue'
import TplSlot from './TplSlot.vue'
type V = 'login' | 'register' | 'steps' | 'verify' | 'forgot' | 'reset' | 'otp'
const v = ref<V>('login')
const layout = ref<'card' | 'split' | 'photo' | 'light' | 'tint'>('card')
const showcase = computed(() => ['photo', 'light', 'tint'].includes(layout.value))
const otp = ref('')
const agree = ref(true)
const plan = ref('f')
const VIEWS = [['login', 'Login'], ['register', 'Register'], ['steps', 'Multi-step'], ['verify', 'Verify'], ['forgot', 'Forgot'], ['reset', 'Reset'], ['otp', '2-step']].map(([value, label]) => ({ value, label }))
const LAYOUTS = [{ value: 'card', label: 'Card' }, { value: 'split', label: 'Split' }, { value: 'photo', label: 'Photo' }, { value: 'light', label: 'Light' }, { value: 'tint', label: 'Tint' }]
const PEOPLE = [{ name: 'Aziz Karimov' }, { name: 'Dilnoza Rahimova' }, { name: 'Omar Hassan' }]
const SHOW: Record<string, Record<string, unknown>> = {
  photo: { headline: 'Glad you are back', caption: 'Plan every journey with ZiyaraGo', quote: 'Design is intelligence made visible' },
  light: { caption: 'Guiding every pilgrim, step by step.', chips: ['Umrah', 'Hajj'], proof: 'Join 20k+ users', proofHint: "Let's see happy customers" },
  tint: { headline: 'Everything for your pilgrims in one place', caption: 'Bookings, rooms and payments, synced.', chips: ['Creating'], proof: 'Join 20k+ users', proofHint: 'Our happy customers' },
}
const T: Record<V, [string, string]> = {
  login: ['Sign in', 'Use the work email or phone from your manager.'],
  register: ['Create an account', 'Start in two minutes.'],
  steps: ['Create an account', 'Three short steps.'],
  verify: ['Verify your email', 'One more step.'],
  forgot: ['Forgot password?', 'We will send a link or a Telegram code.'],
  reset: ['Reset password', 'At least 8 characters.'],
  otp: ['Two-step verification', 'Enter the 6-digit code from Telegram.'],
}
const PLANS = [{ value: 'f', title: 'Free', price: '$0' }, { value: 'p', title: 'Plus', price: '$4.99' }]
const brand = (big: boolean) => h('span', { class: 'ta__brand' }, [h('img', { src: '/3d/logo.png', alt: '', class: big ? 'ta__lg' : 'ta__md' }), 'ZiyaraGo'])
const logoV = () => h(TplSlot, { id: 'logo' }, () => brand(layout.value === 'card'))
const asideV = () => h(TplSlot, { id: 'aside' }, () => h('div', { class: 'ta__aside' }, [
  brand(true),
  h('b', 'Makkah and Madinah, planned in one place'),
  h('span', 'Hotels, tours and prayer times for your guests.'),
]))
const steps = computed(() => [
  { label: 'Account', content: h('div', { class: 'ta__col' }, [h(UiTextField, { label: 'Email', icon: 'mail' }), h(UiPasswordInput, { label: 'Password' })]) },
  { label: 'Personal', content: h('div', { class: 'ta__col' }, [h(UiTextField, { label: 'Full name' }), h(UiPhoneInput, { label: 'Phone' })]) },
  { label: 'Plan', content: h(UiOptionCards, { min: 120, options: PLANS, modelValue: plan.value, onChange: (x: string) => { plan.value = x } }) },
])
</script>

<template>
  <div class="ta">
    <div class="ta__bar"><UiSegmentedControl v-model="v" size="sm" :items="VIEWS" /></div>
    <div class="ta__bar ta__bar--lay"><UiSegmentedControl v-model="layout" size="sm" :items="LAYOUTS" /></div>
    <div :class="layout === 'card' ? 'ta__card' : 'ta__split'" :data-theme="layout === 'light' || layout === 'tint' ? 'light' : undefined">
      <component :is="showcase ? UiAuthShowcase : layout === 'split' ? UiAuthSplit : UiAuthLayout" v-bind="showcase ? { variant: layout, people: PEOPLE, footer: h(TplSlot, { id: 'footer' }, () => h('div', { class: 'ta__row' }, [h('a', { href: '#' }, 'Help'), h('a', { href: '#' }, 'Privacy')])), ...SHOW[layout] } : {}" :title="T[v][0]" :subtitle="T[v][1]" :logo="logoV()" :aside="asideV()">
        <TplSlot id="form">
          <div class="ta__col">
            <template v-if="v === 'login'"><UiLoginForm /><UiSocialAuth :variant="layout === 'photo' ? 'icons' : 'stack'" /></template>
            <template v-else-if="v === 'register'">
              <UiTextField label="Username" />
              <UiTextField label="Email" icon="mail" />
              <UiPasswordInput label="Password" />
              <UiCheckbox v-model="agree" label="I agree to the terms" />
              <UiButton variant="primary" size="lg" block>Sign up</UiButton>
              <div class="ta__row">Already have an account?<button type="button" class="ta__lnk" @click="v = 'login'">Sign in instead</button></div>
            </template>
            <UiStepForm v-else-if="v === 'steps'" :steps="steps" finish-label="Submit" />
            <template v-else-if="v === 'verify'">
              <span class="ta__mute">We sent a link to shodiya@ziyarago.com. Open it to continue.</span>
              <UiButton variant="primary" size="lg" block>Skip for now</UiButton>
              <div class="ta__row">Did not get the email?<button type="button" class="ta__lnk">Resend</button></div>
            </template>
            <template v-else-if="v === 'forgot'">
              <UiTextField label="Email or phone" icon="user-round" />
              <UiButton variant="primary" size="lg" block>Send reset link</UiButton>
              <button type="button" class="ta__lnk" @click="v = 'login'">‹ Back to login</button>
            </template>
            <template v-else-if="v === 'reset'">
              <UiPasswordInput label="New password" />
              <UiPasswordInput label="Confirm password" />
              <UiButton variant="primary" size="lg" block>Set new password</UiButton>
            </template>
            <template v-else>
              <UiCodeInput v-model="otp" />
              <UiButton variant="primary" size="lg" block>Verify my account</UiButton>
              <div class="ta__row">Did not get the code?<button type="button" class="ta__lnk">Resend</button></div>
            </template>
          </div>
        </TplSlot>
        <TplSlot v-if="!showcase" id="footer"><div class="ta__row"><a href="#">Help</a><a href="#">Privacy</a></div></TplSlot>
      </component>
    </div>
  </div>
</template>

<style scoped>
.ta { min-height: 100%; }
.ta__split[data-theme='light'] { background: var(--zg-bg); color: var(--zg-text-1); }
.ta__bar { position: sticky; top: 0; z-index: 20; display: flex; justify-content: center; padding: 10px 10px 4px; }
.ta__bar--lay { position: static; padding: 0 10px 6px; }
.ta__card { position: relative; min-height: 440px; display: grid; place-items: center; padding: 24px; }
.ta__card > :deep(*) { width: 100%; max-width: 440px; }
.ta__card :deep(.zg-auth) { min-height: 0; padding: 0; }
.ta__split :deep(.zg-split2) { min-height: 640px; }
.ta__split :deep(.zg-ash) { min-height: 680px; }
.ta__col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ta__row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; color: var(--zg-text-2); font-size: 14px; }
.ta__row a { color: var(--zg-text-3); font-size: 13px; }
.ta__lnk { all: unset; cursor: pointer; color: var(--zg-brand-text); font-weight: 600; font-size: 14px; }
.ta__mute { color: var(--zg-text-2); line-height: 1.6; }
.ta__aside { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; max-width: 360px; }
.ta__aside b { font-size: 30px; font-weight: 300; letter-spacing: -.03em; line-height: 1.15; }
.ta__aside span:last-child { color: var(--zg-text-2); }
:deep(.ta__brand) { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 20px; }
:deep(.ta__lg) { width: 52px; height: 52px; object-fit: contain; }
:deep(.ta__md) { width: 44px; height: 44px; object-fit: contain; }
</style>
