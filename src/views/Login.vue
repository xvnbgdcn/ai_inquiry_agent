<template>
  <div class="login-page">
    <!-- Left: Characters -->
    <div class="left-panel" ref="leftPanel" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
      <div class="svg-wrap">
        <svg ref="svgRef" viewBox="0 0 500 600" class="chars-svg">
          <defs>
            <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1"/>
            </filter>
          </defs>

          <!-- Character 1: Orange Semicircle -->
          <g class="char-body sway-1" :style="{ transformOrigin: '250px 55px' }">
            <path d="M150 90 A100 65 0 0 1 350 90 Z" :fill="'#FF8C42'" filter="url(#soft-shadow)"/>
            <!-- Eyes -->
            <g :class="{ blink: blinking[0] }">
              <circle :cx="215" :cy="68" r="12" fill="#fff"/>
              <circle :cx="215 + pupilOffset(0).lx" :cy="68 + pupilOffset(0).ly" r="5" fill="#2D1A0A"/>
              <circle :cx="217 + pupilOffset(0).lx" :cy="66 + pupilOffset(0).ly" r="1.8" fill="#fff"/>
            </g>
            <g :class="{ blink: blinking[0] }">
              <circle :cx="285" :cy="68" r="12" fill="#fff"/>
              <circle :cx="285 + pupilOffset(0).rx" :cy="68 + pupilOffset(0).ry" r="5" fill="#2D1A0A"/>
              <circle :cx="287 + pupilOffset(0).rx" :cy="66 + pupilOffset(0).ry" r="1.8" fill="#fff"/>
            </g>
            <!-- Cover hands for password -->
            <g v-if="focusedInput === 'password'" class="cover-hands">
              <rect x="197" y="50" width="36" height="22" rx="11" :fill="'#FF8C42'" stroke="#E07020" stroke-width="2"/>
              <rect x="267" y="50" width="36" height="22" rx="11" :fill="'#FF8C42'" stroke="#E07020" stroke-width="2"/>
            </g>
            <!-- Mouth -->
            <path v-if="expression === 'idle'" d="M235 95 Q250 102 265 95" stroke="#5C3A1E" fill="none" stroke-width="2.5" stroke-linecap="round"/>
            <ellipse v-else-if="expression === 'focused'" cx="250" cy="97" rx="7" ry="3" fill="#5C3A1E"/>
            <ellipse v-else-if="expression === 'surprised'" cx="250" cy="96" rx="8" ry="7" fill="#5C3A1E"/>
            <ellipse v-else-if="expression === 'singing' && mouthOpen" cx="250" cy="96" rx="8" ry="6" fill="#5C3A1E"/>
            <path v-else d="M235 95 Q250 100 265 95" stroke="#5C3A1E" fill="none" stroke-width="2.5" stroke-linecap="round"/>
          </g>

          <!-- Character 2: Purple Rectangle -->
          <g class="char-body sway-2" :style="{ transformOrigin: '110px 290px' }">
            <rect x="60" y="210" width="100" height="140" rx="12" :fill="'#8B5CF6'" filter="url(#soft-shadow)"/>
            <g :class="{ blink: blinking[1] }">
              <circle :cx="85" :cy="255" r="11" fill="#fff"/>
              <circle :cx="85 + pupilOffset(1).lx" :cy="255 + pupilOffset(1).ly" r="4.5" fill="#1A0A2E"/>
              <circle :cx="87 + pupilOffset(1).lx" :cy="253 + pupilOffset(1).ly" r="1.5" fill="#fff"/>
            </g>
            <g :class="{ blink: blinking[1] }">
              <circle :cx="135" :cy="255" r="11" fill="#fff"/>
              <circle :cx="135 + pupilOffset(1).rx" :cy="255 + pupilOffset(1).ry" r="4.5" fill="#1A0A2E"/>
              <circle :cx="137 + pupilOffset(1).rx" :cy="253 + pupilOffset(1).ry" r="1.5" fill="#fff"/>
            </g>
            <g v-if="focusedInput === 'password'" class="cover-hands">
              <rect x="67" y="238" width="34" height="20" rx="10" :fill="'#8B5CF6'" stroke="#6D28D9" stroke-width="2"/>
              <rect x="119" y="238" width="34" height="20" rx="10" :fill="'#8B5CF6'" stroke="#6D28D9" stroke-width="2"/>
            </g>
            <path v-if="expression === 'idle'" d="M97 285 Q110 292 123 285" stroke="#1A0A2E" fill="none" stroke-width="2.5" stroke-linecap="round"/>
            <ellipse v-else-if="expression === 'focused'" cx="110" cy="287" rx="6" ry="2.5" fill="#1A0A2E"/>
            <ellipse v-else-if="expression === 'surprised'" cx="110" cy="286" rx="7" ry="6" fill="#1A0A2E"/>
            <ellipse v-else-if="expression === 'singing' && mouthOpen" cx="110" cy="286" rx="7" ry="5" fill="#1A0A2E"/>
            <path v-else d="M97 285 Q110 292 123 285" stroke="#1A0A2E" fill="none" stroke-width="2.5" stroke-linecap="round"/>
          </g>

          <!-- Character 3: Black Rectangle -->
          <g class="char-body sway-3" :style="{ transformOrigin: '380px 270px' }">
            <rect x="320" y="190" width="120" height="100" rx="8" :fill="'#2D2D2D'" filter="url(#soft-shadow)"/>
            <g :class="{ blink: blinking[2] }">
              <circle :cx="350" :cy="230" r="11" fill="#fff"/>
              <circle :cx="350 + pupilOffset(2).lx" :cy="230 + pupilOffset(2).ly" r="4.5" fill="#0A0A0A"/>
              <circle :cx="352 + pupilOffset(2).lx" :cy="228 + pupilOffset(2).ly" r="1.5" fill="#fff"/>
            </g>
            <g :class="{ blink: blinking[2] }">
              <circle :cx="410" :cy="230" r="11" fill="#fff"/>
              <circle :cx="410 + pupilOffset(2).rx" :cy="230 + pupilOffset(2).ry" r="4.5" fill="#0A0A0A"/>
              <circle :cx="412 + pupilOffset(2).rx" :cy="228 + pupilOffset(2).ry" r="1.5" fill="#fff"/>
            </g>
            <g v-if="focusedInput === 'password'" class="cover-hands">
              <rect x="332" y="213" width="34" height="20" rx="10" :fill="'#2D2D2D'" stroke="#555" stroke-width="2"/>
              <rect x="394" y="213" width="34" height="20" rx="10" :fill="'#2D2D2D'" stroke="#555" stroke-width="2"/>
            </g>
            <path v-if="expression === 'idle'" d="M365 258 Q380 265 395 258" stroke="#fff" fill="none" stroke-width="2" stroke-linecap="round"/>
            <ellipse v-else-if="expression === 'focused'" cx="380" cy="260" rx="6" ry="2.5" fill="#fff"/>
            <ellipse v-else-if="expression === 'surprised'" cx="380" cy="259" rx="7" ry="6" fill="#fff"/>
            <ellipse v-else-if="expression === 'singing' && mouthOpen" cx="380" cy="259" rx="7" ry="5" fill="#fff"/>
            <path v-else d="M365 258 Q380 265 395 258" stroke="#fff" fill="none" stroke-width="2" stroke-linecap="round"/>
          </g>

          <!-- Character 4: Yellow Rounded Rectangle -->
          <g class="char-body sway-4" :style="{ transformOrigin: '250px 460px' }">
            <rect x="150" y="410" width="200" height="90" rx="35" :fill="'#FCD34D'" filter="url(#soft-shadow)"/>
            <g :class="{ blink: blinking[3] }">
              <circle :cx="210" :cy="450" r="13" fill="#fff"/>
              <circle :cx="210 + pupilOffset(3).lx" :cy="450 + pupilOffset(3).ly" r="5.5" fill="#3E2A00"/>
              <circle :cx="212 + pupilOffset(3).lx" :cy="447 + pupilOffset(3).ly" r="2" fill="#fff"/>
            </g>
            <g :class="{ blink: blinking[3] }">
              <circle :cx="290" :cy="450" r="13" fill="#fff"/>
              <circle :cx="290 + pupilOffset(3).rx" :cy="450 + pupilOffset(3).ry" r="5.5" fill="#3E2A00"/>
              <circle :cx="292 + pupilOffset(3).rx" :cy="447 + pupilOffset(3).ry" r="2" fill="#fff"/>
            </g>
            <g v-if="focusedInput === 'password'" class="cover-hands">
              <rect x="190" y="430" width="40" height="24" rx="12" :fill="'#FCD34D'" stroke="#D97706" stroke-width="2"/>
              <rect x="270" y="430" width="40" height="24" rx="12" :fill="'#FCD34D'" stroke="#D97706" stroke-width="2"/>
            </g>
            <path v-if="expression === 'idle'" d="M232 480 Q250 490 268 480" stroke="#3E2A00" fill="none" stroke-width="2.5" stroke-linecap="round"/>
            <ellipse v-else-if="expression === 'focused'" cx="250" cy="483" rx="7" ry="3" fill="#3E2A00"/>
            <ellipse v-else-if="expression === 'surprised'" cx="250" cy="481" rx="9" ry="7" fill="#3E2A00"/>
            <ellipse v-else-if="expression === 'singing' && mouthOpen" cx="250" cy="481" rx="9" ry="6" fill="#3E2A00"/>
            <path v-else d="M232 480 Q250 490 268 480" stroke="#3E2A00" fill="none" stroke-width="2.5" stroke-linecap="round"/>
          </g>
        </svg>
      </div>
    </div>

    <!-- Right: Login Form -->
    <div class="right-panel">
      <div class="form-wrap">
        <h1 class="form-title">Welcome Back</h1>
        <p class="form-sub">Enter your credentials to continue</p>

        <div class="field-group" :class="{ focused: focusedInput === 'email', filled: form.email }">
          <label class="field-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="field-input"
            placeholder="name@example.com"
            @focus="onEmailFocus"
            @blur="onBlur"
            @input="onInputDebounced"
          />
        </div>

        <div class="field-group" :class="{ focused: focusedInput === 'password', filled: form.password }">
          <label class="field-label">Password</label>
          <div class="password-wrap">
            <input
              v-model="form.password"
              :type="showPwd ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              @focus="onPasswordFocus"
              @blur="onBlur"
              @input="onInputDebounced"
            />
            <button type="button" class="toggle-pwd" @click="showPwd = !showPwd">
              {{ showPwd ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <button
          class="btn-login"
          :class="{ loading: loading, 'has-content': form.email && form.password }"
          :disabled="loading"
          @click="handleLogin"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-else>Sign In</span>
        </button>

        <p class="form-footer">
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

const leftPanel = ref(null)
const svgRef = ref(null)

const form = reactive({ email: '', password: '' })
const showPwd = ref(false)
const loading = ref(false)

// Interaction states
const mouseX = ref(-999)
const mouseY = ref(-999)
const mouseInPanel = ref(false)
const focusedInput = ref(null) // null | 'email' | 'password'
const expression = ref('idle') // 'idle' | 'focused' | 'surprised' | 'singing'
const mouthOpen = ref(false)

// Blinking state per character
const blinking = ref([false, false, false, false])

// Eye data per character: [leftEyeCx, leftEyeCy, rightEyeCx, rightEyeCy, pupilMaxRadius]
const eyeData = [
  { lex: 215, ley: 68, rex: 285, rey: 68, maxR: 4 },   // orange
  { lex: 85, ley: 255, rex: 135, rey: 255, maxR: 3.5 },  // purple
  { lex: 350, ley: 230, rex: 410, rey: 230, maxR: 3.5 },  // black
  { lex: 210, ley: 450, rex: 290, rey: 450, maxR: 4.5 },  // yellow
]

function pupilOffset(idx) {
  if (!mouseInPanel.value || !svgRef.value) {
    return { lx: 0, ly: 0, rx: 0, ry: 0 }
  }
  const rect = svgRef.value.getBoundingClientRect()
  const svgX = ((mouseX.value - rect.left) / rect.width) * 500
  const svgY = ((mouseY.value - rect.top) / rect.height) * 600

  const ed = eyeData[idx]
  const compute = (ex, ey) => {
    const dx = svgX - ex
    const dy = svgY - ey
    const dist = Math.sqrt(dx * dx + dy * dy)
    const clamp = Math.min(dist, ed.maxR)
    if (dist < 0.5) return { dx: 0, dy: 0 }
    return { dx: (dx / dist) * clamp, dy: (dy / dist) * clamp }
  }
  const lo = compute(ed.lex, ed.ley)
  const ro = compute(ed.rex, ed.rey)
  return { lx: lo.dx, ly: lo.dy, rx: ro.dx, ry: ro.dy }
}

// Mouse tracking
function onMouseMove(e) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  mouseInPanel.value = true
}
function onMouseLeave() {
  mouseInPanel.value = false
}

// Focus handlers
function onEmailFocus() {
  focusedInput.value = 'email'
  expression.value = 'focused'
}
function onPasswordFocus() {
  focusedInput.value = 'password'
  expression.value = 'surprised'
}
function onBlur() {
  focusedInput.value = null
  expression.value = 'idle'
}

// Typing debounce
let typingTimer = null
let mouthTimer = null
function onInputDebounced() {
  if (typingTimer) clearTimeout(typingTimer)
  expression.value = 'singing'
  startMouthAnim()
  typingTimer = setTimeout(() => {
    expression.value = focusedInput.value ? (focusedInput.value === 'password' ? 'surprised' : 'focused') : 'idle'
    stopMouthAnim()
  }, 600)
}

function startMouthAnim() {
  if (mouthTimer) return
  mouthOpen.value = true
  mouthTimer = setInterval(() => {
    mouthOpen.value = !mouthOpen.value
  }, 220)
}
function stopMouthAnim() {
  if (mouthTimer) {
    clearInterval(mouthTimer)
    mouthTimer = null
  }
  mouthOpen.value = false
}

// Blink timers
const blinkTimers = []
function scheduleBlink(idx) {
  const delay = 2000 + Math.random() * 4000
  blinkTimers[idx] = setTimeout(() => {
    blinking.value[idx] = true
    setTimeout(() => {
      blinking.value[idx] = false
      scheduleBlink(idx)
    }, 130)
  }, delay)
}

// Login handler
function handleLogin() {
  if (!form.email || !form.password || loading.value) return
  loading.value = true
  setTimeout(() => {
    loading.value = false
    alert('Login simulation complete.\n(This is a demo page)')
  }, 2000)
}

onMounted(() => {
  for (let i = 0; i < 4; i++) scheduleBlink(i)
})

onUnmounted(() => {
  blinkTimers.forEach(t => clearTimeout(t))
  if (typingTimer) clearTimeout(typingTimer)
  stopMouthAnim()
})
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
}

/* ===== Left Panel ===== */
.left-panel {
  flex: 0 0 46%;
  background: #F2F3F5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: default;
}

.svg-wrap {
  width: 90%;
  max-width: 460px;
}

.chars-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Sway animations */
.char-body { transition: transform 0.3s ease; }
.sway-1 { animation: sway1 4.2s ease-in-out infinite; }
.sway-2 { animation: sway2 3.8s ease-in-out infinite; }
.sway-3 { animation: sway3 4.5s ease-in-out infinite; }
.sway-4 { animation: sway4 3.5s ease-in-out infinite; }

@keyframes sway1 {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  30% { transform: rotate(1.5deg) translateY(-3px); }
  70% { transform: rotate(-1deg) translateY(2px); }
}
@keyframes sway2 {
  0%, 100% { transform: rotate(0deg) translateX(0); }
  40% { transform: rotate(-1.2deg) translateX(3px); }
  80% { transform: rotate(0.8deg) translateX(-2px); }
}
@keyframes sway3 {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  25% { transform: rotate(-1.8deg) translateY(2px); }
  75% { transform: rotate(1.2deg) translateY(-3px); }
}
@keyframes sway4 {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  50% { transform: rotate(1deg) translateY(-2px); }
}

/* Blink */
.blink {
  animation: blinkAnim 0.13s ease-in-out;
}
@keyframes blinkAnim {
  0% { transform: scaleY(1); }
  50% { transform: scaleY(0.08); }
  100% { transform: scaleY(1); }
}

/* Cover hands appear on password focus */
.cover-hands {
  animation: handsIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes handsIn {
  0% { opacity: 0; transform: translateY(-14px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* ===== Right Panel ===== */
.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 40px;
}

.form-wrap {
  width: 100%;
  max-width: 400px;
}

.form-title {
  font-size: 30px;
  font-weight: 700;
  color: #1A1A2E;
  margin-bottom: 6px;
  letter-spacing: -0.3px;
}

.form-sub {
  font-size: 15px;
  color: #8E8E9A;
  margin-bottom: 32px;
}

/* Field */
.field-group {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #6B6B7B;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.2s;
}

.field-group.focused .field-label {
  color: #4F46E5;
}

.field-input {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  font-size: 15px;
  color: #1A1A2E;
  background: #F8F8FC;
  border: 2px solid #E8E8EF;
  border-radius: 14px;
  outline: none;
  transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
  font-family: inherit;
  box-sizing: border-box;
}

.field-input::placeholder {
  color: #C0C0CC;
}

.field-group.focused .field-input {
  border-color: #4F46E5;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
}

.field-group.filled .field-input {
  border-color: #C4C4D4;
  background: #fff;
}

/* Password field */
.password-wrap {
  position: relative;
}

.toggle-pwd {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.toggle-pwd:hover { opacity: 1; }

/* Button */
.btn-login {
  width: 100%;
  height: 52px;
  margin-top: 10px;
  border: none;
  border-radius: 14px;
  background: #1A1A2E;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-login:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 28px rgba(26, 26, 46, 0.25);
  background: #2D2D4A;
}

.btn-login.has-content {
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.btn-login:active {
  transform: scale(0.98);
}

.btn-login:disabled {
  cursor: not-allowed;
  transform: none;
}

.btn-login.loading {
  background: #6B6B8A;
}

/* Spinner */
.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Footer */
.form-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #8E8E9A;
}

.form-footer a {
  color: #4F46E5;
  text-decoration: none;
  font-weight: 600;
}
.form-footer a:hover {
  text-decoration: underline;
}

</style>

<style>
/* Override H5 mobile constraint for PC login page */
#app {
  max-width: none;
}
</style>
