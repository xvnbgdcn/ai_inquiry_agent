<template>
  <div class="home">
    <div class="home-header">
      <div class="logo-icon">🩺</div>
      <h1>AI 医疗问诊</h1>
      <p class="subtitle">智能健康助手 · 24小时在线</p>
    </div>

    <div class="disclaimer">
      <span class="disclaimer-icon">⚠️</span>
      <span>本AI助手提供健康咨询参考，不能替代专业医生诊断。紧急情况请拨打120。</span>
    </div>

    <div class="quick-section">
      <h2 class="section-title">常见症状咨询</h2>
      <SymptomSelector @select="startConsultation" />
    </div>

    <div class="custom-section">
      <h2 class="section-title">描述你的症状</h2>
      <div class="custom-input-wrapper">
        <textarea
          ref="inputRef"
          v-model="userInput"
          class="custom-input"
          placeholder="请详细描述你的症状，例如：头痛持续了两天，伴有发热..."
          rows="3"
          maxlength="500"
          @keydown.enter.exact.prevent="startCustomConsultation"
        ></textarea>
        <div class="input-footer">
          <span class="char-count">{{ userInput.length }}/500</span>
          <button
            class="btn-start"
            :disabled="!userInput.trim()"
            @click="startCustomConsultation"
          >
            开始问诊
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SymptomSelector from '../components/SymptomSelector.vue'

const router = useRouter()
const userInput = ref('')

function startConsultation(symptom) {
  router.push({ path: '/chat', query: { q: symptom } })
}

function startCustomConsultation() {
  const text = userInput.value.trim()
  if (!text) return
  router.push({ path: '/chat', query: { q: text } })
}
</script>

<style scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px 20px 24px;
  overflow-y: auto;
}

.home-header {
  text-align: center;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 56px;
  margin-bottom: 8px;
}

.home-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.disclaimer {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #FFF8E1;
  border-radius: var(--radius-sm);
  padding: 12px;
  margin-bottom: 24px;
  font-size: 13px;
  color: #8D6E00;
  line-height: 1.5;
}

.disclaimer-icon {
  flex-shrink: 0;
  font-size: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.quick-section {
  margin-bottom: 24px;
}

.custom-input-wrapper {
  background: var(--bg);
  border-radius: var(--radius);
  padding: 12px;
  border: 1.5px solid var(--border);
  transition: border-color 0.2s;
}

.custom-input-wrapper:focus-within {
  border-color: var(--primary);
}

.custom-input {
  width: 100%;
  border: none;
  background: transparent;
  resize: none;
  font-size: 15px;
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  line-height: 1.6;
}

.custom-input::placeholder {
  color: var(--text-light);
}

.input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.char-count {
  font-size: 12px;
  color: var(--text-light);
}

.btn-start {
  padding: 8px 24px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}

.btn-start:hover {
  background: var(--primary-dark);
}

.btn-start:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
