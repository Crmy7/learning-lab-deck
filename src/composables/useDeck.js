import { ref } from 'vue'

// État de navigation partagé par tout le deck (singleton module-level).
const current = ref(0)
const total = ref(0)

function go(n) {
  current.value = Math.max(0, Math.min(total.value - 1, n))
}

function setTotal(n) {
  total.value = n
}

export function useDeck() {
  return { current, total, go, setTotal }
}
