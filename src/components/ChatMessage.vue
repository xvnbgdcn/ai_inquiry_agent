<template>
  <div class="message-wrapper" :class="isUser ? 'user' : 'ai'">
    <div v-if="!isUser" class="avatar">🩺</div>
    <div class="bubble" :class="{ 'bubble-user': isUser, 'bubble-ai': !isUser }">
      <div class="message-content" v-html="renderedContent"></div>
      <span v-if="streaming" class="cursor-blink">|</span>
    </div>
    <div v-if="isUser" class="avatar user-avatar">👤</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  streaming: {
    type: Boolean,
    default: false
  }
})

const isUser = computed(() => props.message.role === 'user')

const renderedContent = computed(() => {
  let text = props.message.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Bold: **text**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Newlines to <br>
  text = text.replace(/\n/g, '<br>')
  // List items
  text = text.replace(/^(\d+\.\s)/gm, '<br>$1')
  text = text.replace(/^(-|\*)\s/gm, '<br>• ')
  return text
})
</script>

<style scoped>
.message-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message-wrapper.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  background: #E8F4FD;
}

.user-avatar {
  background: #E8ECF1;
}

.bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: var(--radius);
  line-height: 1.6;
  font-size: 15px;
  word-break: break-word;
}

.bubble-user {
  background: var(--primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.bubble-ai {
  background: #fff;
  color: var(--text-primary);
  border-bottom-left-radius: 4px;
  box-shadow: var(--shadow);
}

.message-content {
  white-space: pre-wrap;
}

.cursor-blink {
  color: var(--primary);
  font-weight: 700;
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
