import './stateIcon.scss'

const states = {
  success: 'el-icon-circle-check el-node-state-success',
  error: 'el-icon-circle-close el-node-state-error',
  warning: 'el-icon-warning-outline el-node-state-warning',
  running: 'el-icon-loading el-node-state-running'
}

export default {
  render(createElement) {
    const state = this.state || 'running'
    return createElement('i',
      { class: states[state] }
    )
  },
  props: {
    state: {
      type: String,
      required: true
    }
  }
}
