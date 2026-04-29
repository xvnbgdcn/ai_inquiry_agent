<template>
  <div class="symptom-grid">
    <button
      v-for="item in symptoms"
      :key="item.label"
      class="symptom-card"
      @click="$emit('select', item.query)"
    >
      <span class="symptom-icon">{{ item.icon }}</span>
      <span class="symptom-label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup>
defineEmits(['select'])

const symptoms = [
  { icon: '🤒', label: '发热发烧', query: '我发烧了，体温38.5度，浑身无力，该怎么办？' },
  { icon: '🤧', label: '感冒咳嗽', query: '我感冒了，咳嗽流鼻涕，喉咙痛，需要吃什么药？' },
  { icon: '😣', label: '头痛头晕', query: '最近经常头痛头晕，持续了一周，可能是什么原因？' },
  { icon: '🤢', label: '肠胃不适', query: '胃疼拉肚子，恶心想吐，是不是急性肠胃炎？' },
  { icon: '😴', label: '失眠焦虑', query: '最近失眠严重，入睡困难，容易焦虑，怎么办？' },
  { icon: '💪', label: '腰酸背痛', query: '长期久坐办公，腰背酸痛，有什么缓解方法？' },
  { icon: '🦷', label: '口腔问题', query: '牙龈肿痛出血，牙齿敏感，需要怎么处理？' },
  { icon: '🩸', label: '高血压', query: '血压偏高，高压150低压95，需要吃药控制吗？' },
]
</script>

<style scoped>
.symptom-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.symptom-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 6px;
  background: #fff;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
}

.symptom-card:hover {
  border-color: var(--primary);
  background: #F0F7FF;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74,144,217,0.15);
}

.symptom-card:active {
  transform: scale(0.96);
}

.symptom-icon {
  font-size: 28px;
}

.symptom-label {
  font-size: 13px;
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
}
</style>
