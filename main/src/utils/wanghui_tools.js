// 字符串去首尾空
String.prototype.wh_strip = function () {
  let str = this;
  str = str.replace(/^[ \t]*/, '');
  str = str.replace(/[ \t]*$/, '');
  return str
};

// 列表去空 // 大佬，列表循环时请用of，in有问题
Array.prototype.wh_drop_null = function () {
  let res = [];
  let li = this;
  li.map(i => {
    if (i)
      res.push(i)
  });
  return res
};

// 列表enumerate // 大佬，列表循环时请用of，in有问题
Array.prototype.wh_enumerate = function () {
  let li = this;
  let n = 0;
  let res = [];
  for (let i of li) {
    res.push({'k': n, 'v': i});
    n += 1
  }
  return res
};


export function getRandomStr(len) {
  len = len || 32;
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  // let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678oOLl9gqVvUuI1';
  // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
  let random_str = '';
  for (let i = 0; i < len; i++) {
    random_str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return random_str
}

export function copyToClipboard(text) {
  let textareaEl = document.createElement('textarea');
  textareaEl.setAttribute('readonly', 'readonly'); // 防止手机上弹出软键盘
  textareaEl.value = text;
  document.body.appendChild(textareaEl);
  textareaEl.select();
  let res = document.execCommand('copy');
  document.body.removeChild(textareaEl);
  console.log("复制成功");
  return res;
}

export function timestampToTimeStr(timestamp, need_second) {
  // 时间戳转时间字符串
  const date = timestamp ? new Date(timestamp) : new Date()
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  const h = ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
  const m = ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  const s = ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  if (!need_second) {
    return Y + M + D + h + m
  } else {
    return Y + M + D + h + m + s
  }
}

export function get_array_dict_value(array_dict, key, reverse) {
  if (!reverse) {
    for (const i of array_dict) {
      if (i[0] === key) {
        return i[1]
      }
    }
  } else {
    for (const i of array_dict) {
      if (i[1] === key) {
        return i[0]
      }
      console.log(key)
      console.log(i[1])
    }
  }
}
