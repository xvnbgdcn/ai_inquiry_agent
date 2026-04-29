<template>
  <div class="input-bar">
    <div class="input-row">
      <input
        ref="inputRef"
        v-model="text"
        class="input-field"
        placeholder="描述你的症状..."
        :disabled="disabled"
        maxlength="500"
        @keydown.enter="handleSend"
      />
      <button
        class="btn-send"
        :class="{ active: text.trim() && !disabled }"
        :disabled="!text.trim() || disabled"
        @click="handleSend"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  disabled: Boolean
})

const emit = defineEmits(['send'])

const text = ref('')

function handleSend() {
  const val = text.value.trim()
  if (!val || props.disabled) return
  emit('send', val)
  text.value = ''
}
</script>

<style scoped>
.input-bar {
  padding: 10px 16px;
  padding-bottom: max(10px, var(--safe-bottom));
  background: #fff;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-field {
  flex: 1;
  height: 42px;
  padding: 0 16px;
  border: 1.5px solid var(--border);
  border-radius: 21px;
  font-size: 15px;
  color: var(--text-primary);
  outline: none;
  background: var(--bg);
  transition: border-color 0.2s;
  font-family: inherit;
}

.input-field:focus {
  border-color: var(--primary);
}

.input-field:disabled {
  opacity: 0.6;
}

.input-field::placeholder {
  color: var(--text-light);
}

.btn-send {
  width: 64px;
  height: 42px;
  border-radius: 21px;
  border: none;
  background: var(--border);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.btn-send.active {
  background: var(--primary);
}

.btn-send.active:hover {
  background: var(--primary-dark);
}

.btn-send:disabled {
  cursor: not-allowed;
}
</style>
