import request from '@/utils/request3'
import { default as request1 } from '@/utils/request4'
// 度量大盘导出
export function downQuality(query) {
    return request1({
        url: `/devops/quality/qualityDatas/export/?${query}`,
        responseType: 'blob',
        method: 'get'
    })
}
// 主管错发件上报查询(分页)
export function qualityDatas(params) {
    return request({
        url: `/devops/quality/qualityDatas/`,
        method: 'get',
        params
    })
}
// 漏洞更新接口
export function updateLeak(ID, data) {
    return request({
        url: `/devops/quality/qualityDatas/${ID}/`,
        method: 'put',
        data
    })
}
// 质量大盘导出
export function qualityExport(params) {
    return request({
        url: `/devops/quality/qualityDatas/export/`,
        method: 'get',
        params
    })
}
// 需求列表查询
export function demandSearch(params) {
    return request({
        url: `/devops/project/issue/`,
        method: 'get',
        params
    })
}
// 漏洞类型查询
export function leaksSearch(params) {
    return request({
        url: `/devops/quality/leaks`,
        method: 'get',
        params
    })
}
// 漏洞更新接口
export function updateLeaks(data) {
    return request({
        url: `/devops/quality/leaks/update/`,
        method: 'post',
        data
    })
}
// 项目列表查询
export function projectList(params) {
    return request({
        url: `/devops/project/project/`,
        method: 'get',
        params
    })
}
// 提测单构建部署
export function buildExc(params) {
    return request({
        url: `/devops/deploy/test_run/`,
        method: 'post',
        params
    })
}
// 仓库查询
export function seachgit(params) {
    return request({
        url: `/devops/deploy/testgitaddr/`,
        method: 'get',
        params
    })
}
// 创建仓库
export function creategitproject(data) {
    return request({
        url: `/devops/deploy/creategitproject/`,
        method: 'post',
        data
    })
}
// 获取提测单列表
export function getTestList(params) {
    return request({
        url: `/devops/test/testview/`,
        method: 'get',
        params
    })
}
// 需求关联应用
export function demandRelated(data) {
    return request({
        url: `/devops/common/demand/`,
        method: 'post',
        data
    })
}
// 提测单确认驳回
export function rejectTest(data) {
    return request({
        url: `/devops/test/testview/`,
        method: 'put',
        data
    })
}
// 新建提测单
export function sumbitTest(data) {
    return request({
        url: `/devops/test/testview/`,
        method: 'post',
        data
    })
}
// 构建部署列表
export function bulidMentList(params) {
    return request({
        url: `/devops/deploy/builddeployment/`,
        method: 'get',
        params
    })
}
// 构建部署历史页面
export function buildReport(params) {
    return request({
        url: `/devops/deploy/report/`,
        method: 'get',
        params
    })
}

// 下拉框选择数据接口;
// 项目状态
export function pstatus(params) {
    return request({
        url: `/devops/project/pstatus/`,
        method: 'get',
        params
    })
}
// 项目组/研发组;
export function seachProject(params) {
    return request({
        url: `/devops/common/seachprojectteam/`,
        method: 'get',
        params
    })
}
// 产品状态
export function seachProduct(params) {
    return request({
        url: `/devops/common/seachprojectline/`,
        method: 'get',
        params
    })
}
// 仓库状态
export function searchGits(params) {
    return request({
        url: `/devops/common/seachgit/`,
        method: 'get',
        params
    })
}
// 资源信息列表
export function sourceList(params) {
    return request({
        url: `/devops/resources/source/`,
        method: 'get',
        params
    })
}
// 测试状态
export function teststatus(params) {
    return request({
        url: `/devops/project/teststatus`,
        method: 'get',
        params
    })
}
// 需求优先级
export function demandLevel(params) {
    return request({
        url: `/devops/project/dlevel/`,
        method: 'get',
        params
    })
}
// 项目
export function projlist(params) {
    return request({
        url: `/devops/project/projlist/`,
        method: 'get',
        params
    })
}
// 发布版本（模糊搜索）
export function demandVersion(params) {
    return request({
        url: `/devops/project/demandversion/`,
        method: 'get',
        params
    })
}
// 项目导出
export function downProject(query) {
    return request1({
        url: `/devops/project/export/?${query}`,
        responseType: 'blob',
        method: 'get'
    })
}
// 需求导出
export function downDexport(query) {
    return request1({
        url: `/devops/project/dexport/?${query}`,
        responseType: 'blob',
        method: 'get'
    })
}
// 应用app
export function searchApp(params) {
    return request({
        url: `/devops/common/seachapp/`,
        method: 'get',
        params
    })
}
// 分支查询
export function seachbranch(params) {
    return request({
        url: `/devops/common/seachbranch/`,
        method: 'get',
        params
    })
}
// 项目部门分类
export function depart(params) {
    return request({
        url: `/devops/common/projectcategory/`,
        method: 'get',
        params
    })
}
// import { get, put, post } from './axios.js';
// export default {
//     // getLogin: (params) => get(`http://qms.yto.net.cn/qms/login_dd?code=` + params),
//     // 主管错发件上报查询(分页)
//     qualityDatas: params => get(`${process.env.VUE_APP_QUALITY}/devops/quality/qualityDatas/`, params),
//     // 漏洞更新接口
//     updateLeak: (ID, params) => put(`${process.env.VUE_APP_QUALITY}/devops/quality/qualityDatas/${ID}/`, params),
//     // 质量大盘导出
//     qualityExport: (params) => get(`${process.env.VUE_APP_QUALITY}/devops/quality/qualityDatas/export/`, params),
//     // 需求列表查询
//     demandSearch: (params) => get(`${process.env.VUE_APP_QUALITY}/devops/project/issue/`, params),
//     // 漏洞类型查询
//     leaksSearch: (params) => get(`${process.env.VUE_APP_QUALITY}/devops/quality/leaks`, params),
//     // 漏洞更新接口
//     updateLeaks: (params) => post(`${process.env.VUE_APP_QUALITY}/devops/quality/leaks/update/`, params),
//     // 项目列表查询
//     projectList: (params) => get(`${process.env.VUE_APP_QUALITY}/devops/project/project/`, params),
//     // 提测单构建部署
//     buildExc: (params) => post(`${process.env.VUE_APP_QUALITY}/devops/deploy/test_run/`, params),
//     // 仓库查询
//     seachgit: (params) => get(`${process.env.VUE_APP_QUALITY}/devops/deploy/testgitaddr/`, params),
//     // 获取提测单列表
//     getTestList: params => get(`${process.env.VUE_APP_QUALITY}/devops/test/testview/`, params),
//     // 需求关联应用
//     demandRelated: params => post(`${process.env.VUE_APP_QUALITY}/devops/common/demand/`, params),
//     // 提测单确认驳回
//     rejectTest: params => put(`${process.env.VUE_APP_QUALITY}/devops/test/testview/`, params),
//     // 新建提测单
//     sumbitTest: params => post(`${process.env.VUE_APP_QUALITY}/devops/test/testview/`, params),
//     // 构建部署列表
//     bulidMentList: params => get(`${process.env.VUE_APP_QUALITY}/devops/deploy/builddeployment/`, params),
//     // 构建部署历史页面
//     buildReport: params => get(`${process.env.VUE_APP_QUALITY}/devops/deploy/report/`, params),

//     // 下拉框选择数据接口;
//     // 项目状态
//     pstatus: params => get(`${process.env.VUE_APP_QUALITY}/devops/project/pstatus/`, params),
//     // 项目组/研发组;
//     seachProject: params => get(`${process.env.VUE_APP_QUALITY}/devops/common/seachprojectteam/`, params),
//     // 产品状态
//     seachProduct: params => get(`${process.env.VUE_APP_QUALITY}/devops/common/seachprojectline/`, params),
//     // 仓库状态
//     searchGits: params => get(`${process.env.VUE_APP_QUALITY}/devops/common/seachgit/`, params),
//     // 资源信息列表
//     sourceList: params => get(`${process.env.VUE_APP_QUALITY}/devops/resources/source/`, params),
//     // 测试状态
//     teststatus: params => get(`${process.env.VUE_APP_QUALITY}/devops/project/teststatus`, params),
//     // 需求优先级
//     demandLevel: params => get(`${process.env.VUE_APP_QUALITY}/devops/project/dlevel/`, params),
//     // 项目
//     projlist: params => get(`${process.env.VUE_APP_QUALITY}/devops/project/projlist/`, params),
//     // 发布版本（模糊搜索）
//     demandVersion: params => get(`${process.env.VUE_APP_QUALITY}/devops/project/demandversion/`, params),
//     // 应用app
//     searchApp: params => get(`${process.env.VUE_APP_QUALITY}/devops/common/seachapp/`, params),
//     // 分支查询
//     seachbranch: (params) => get(`${process.env.VUE_APP_QUALITY}/devops/common/seachbranch/`, params),
//     // 项目部门分类
//     depart: (params) => get(`${process.env.VUE_APP_QUALITY}/devops/common/projectcategory/`, params),
//     // 登陆;
//     getLogin: (params) => get(`${process.env.VUE_APP_QUALITY}/devops/common/userinfo/`, params),
//     // 退出;
//     getLogout: (params) => get(`${process.env.VUE_APP_QUALITY}/devops/common/signout/`, params)
// };
