### 常用网站
https://element.eleme.cn/2.7.2/#/zh-CN/component/installation  
https://cn.vuejs.org/ 
https://panjiachen.github.io/vue-element-admin-site/ 
http://jquery.cuishifeng.cn/index.html 
https://echarts.baidu.com/examples/index.html?theme=dark 
 

### 常用路径

1.路由设置模块:
   路径src/router/index.js 
   这个是默认加载的文件，然后通过这个文件再引用其他文件
   cmdb相关的页面路由
   link 外部网站的链接地址页面
   manage 管理页面相关
   zabbix zabbix监控相关
   workflow 工作流相关
   
   
2.接口相关
   路径src/api/zabbix.js 
   不同的页面条用接口，按照views中的目录新建api中对应的文件，然后引用
 
 3. icons  图标
 
 4 assets 静态文件存放路径
 
 5 componetns 公共组件目录，一些常用的公共组件可以放这里
 
 6 views 所有的用户自定义页面放到这个位置，根据项目名，不同的项目放到不同的目录
 
 ### 参考样例
 
 表格类的可以参考
 src/views/zabbix/alarm_tables.vue 审计查询和修改的功能

 
 功能没有完全开发完成的页面，不要放到前端
 可以再路径中加入 roles: ['deploy'] 角色来控制
 
 
 ### 安装依赖
   element-ui 版本是2.7
   切换到vue-master 的根目录执行 npm install --save jsencrypt 