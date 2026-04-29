<template>
  <div class="chat-page">
    <!-- Header -->
    <header class="chat-header">
      <button class="btn-back" @click="$router.push('/')">
        <span class="back-arrow">‹</span>
      </button>
      <div class="header-info">
        <span class="header-avatar">🩺</span>
        <div>
          <div class="header-name">AI 问诊助手</div>
          <div class="header-status">在线</div>
        </div>
      </div>
      <button class="btn-clear" @click="clearChat" title="清空对话">
        <span>🗑️</span>
      </button>
    </header>

    <!-- Messages -->
    <div ref="msgContainer" class="chat-messages">
      <div v-if="messages.length === 0 && !streaming" class="empty-state">
        <div class="empty-icon">💬</div>
        <p>请描述你的症状，我将为你提供健康咨询</p>
        <div class="empty-hints">
          <span v-for="hint in quickHints" :key="hint" class="hint-tag" @click="sendMessage(hint)">{{ hint }}</span>
        </div>
      </div>

      <ChatMessage
        v-for="(msg, idx) in messages"
        :key="idx"
        :message="msg"
        :streaming="streaming && idx === messages.length - 1 && msg.role === 'assistant'"
      />

      <div v-if="errorMsg" class="error-banner">
        <span>{{ errorMsg }}</span>
        <button @click="retryLastMessage">重试</button>
      </div>
    </div>

    <!-- Input -->
    <ChatInput
      :disabled="streaming"
      @send="sendMessage"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ChatMessage from '../components/ChatMessage.vue'
import ChatInput from '../components/ChatInput.vue'
import { sendMessageStream } from '../api/deepseek.js'

const route = useRoute()
const messages = ref([])
const streaming = ref(false)
const errorMsg = ref('')
const msgContainer = ref(null)

const quickHints = [
  '我头痛了两天，还伴有恶心',
  '最近一直咳嗽，晚上更严重',
  '腰痛持续一周了，久坐加重'
]

const STORAGE_KEY = 'med_chat_history'

onMounted(() => {
  loadHistory()
  const query = route.query.q
  if (query) {
    sendMessage(decodeURIComponent(query))
  }
})

watch(messages, () => {
  nextTick(() => scrollToBottom())
}, { deep: true })

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) messages.value = JSON.parse(saved)
  } catch {}
}

function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
  } catch {}
}

function scrollToBottom() {
  const el = msgContainer.value
  if (el) el.scrollTop = el.scrollHeight
}

async function sendMessage(text) {
  if (!text.trim() || streaming.value) return

  errorMsg.value = ''
  messages.value.push({ role: 'user', content: text.trim() })

  // Create empty assistant message to stream into
  messages.value.push({ role: 'assistant', content: '' })
  const assistantMsg = messages.value[messages.value.length - 1]
  const recent = messages.value.slice(-21) // includes user msg + empty assistant, remove assistant for API
  const apiMessages = recent.filter(m => m.content !== '').slice(-20)

  streaming.value = true
  try {
    for await (const chunk of sendMessageStream(apiMessages)) {
      assistantMsg.content += chunk
    }
  } catch (e) {
    errorMsg.value = e.message || '请求失败，请检查网络后重试'
    // Remove empty/partial assistant message on error
    if (!assistantMsg.content) {
      messages.value.pop()
    }
  } finally {
    streaming.value = false
    saveHistory()
  }
}

function retryLastMessage() {
  const userMsgs = [...messages.value].reverse().filter(m => m.role === 'user')
  if (userMsgs.length === 0) return
  // Remove last assistant message (partial or failed)
  if (messages.value[messages.value.length - 1]?.role === 'assistant') {
    messages.value.pop()
  }
  errorMsg.value = ''
  sendMessage(userMsgs[0].content)
}

function clearChat() {
  messages.value = []
  errorMsg.value = ''
  localStorage.removeItem(STORAGE_KEY)
}
</script>

<style scoped>
.chat-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  flex-shrink: 0;
}

.btn-back {
  background: rgba(255,255,255,0.2);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.back-arrow {
  margin-top: -2px;
}

.header-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-avatar {
  font-size: 28px;
}

.header-name {
  font-size: 16px;
  font-weight: 600;
}

.header-status {
  font-size: 12px;
  opacity: 0.85;
}

.btn-clear {
  background: rgba(255,255,255,0.2);
  border: none;
  font-size: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--bg);
}

.empty-state {
  text-align: center;
  padding-top: 60px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 15px;
  margin-bottom: 20px;
}

.empty-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.hint-tag {
  display: inline-block;
  padding: 8px 14px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 13px;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s;
}

.hint-tag:hover {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #FFF1F0;
  border: 1px solid #FFCCC7;
  border-radius: var(--radius-sm);
  margin-top: 8px;
  font-size: 13px;
  color: var(--danger);
}

.error-banner button {
  background: var(--danger);
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
}
</style>
