const stys = ['',
  { class: 'el-rate__icon el-icon-star-on', style: 'color: #F7BA2A;' },
  { class: 'el-rate__icon el-icon-star-on', style: 'color: #F7BA2A;' },
  { class: 'el-rate__icon el-icon-star-on', style: 'color: #F7BA2A;' },
  { class: 'el-rate__icon el-icon-star-on', style: 'color: #FF8800;' },
  { class: 'el-rate__icon el-icon-star-on', style: 'color: #f55c5c;' }
]
export function star(createElement, starval) {
  return createElement(
    'div',
    {
      'class': 'el-rate'
    },
    Array.apply(null, { length: starval || 0 }).map(() => {
      return createElement('span',
        { class: 'el-rate__item', style: 'cursor: pointer;' },
        [createElement('i', stys[starval])]
      )
    })
  )
}
export default {
  render: function(createElement) {
    return star(createElement, this.star)
  },
  props: {
    star: Number,
    required: true
  }
}
