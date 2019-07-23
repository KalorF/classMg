const baseUrl = 'http://localhost:8080/ClassManagement/' // 基础接口
// const baseUrl = 'http://192.168.1.151:8080/ClassManagement/'

const api = {
  dwonloadUrl: 'http://localhost:8080/ClassManagement/file/', // 下载链接
  login: baseUrl + 'UserController/login/', // 用户登陆
  registerUser: baseUrl + 'UserController/registerUser', // 用户注册
  getUserMessageById: baseUrl + 'UserController/getUserMessageById', // 获取用户信息
  getAllGrade: baseUrl + 'GradeController/getAllGrade', // 获取班级
  updateStudentMessage: baseUrl + 'SuperAdminController/updateStudentMessage', // 修改用户信息
  updatePassword: baseUrl + 'UserController/updatePassword', // 用户修改密码
  RegisteredStudentId: baseUrl + 'SuperAdminController/RegisteredStudentId', // 添加学生账号
  RegisteredGrade: baseUrl + 'SuperAdminController/RegisteredGrade', // 添加班级
  getAllUser: baseUrl + 'UserController/getAllUser', // 获取所有学生信息
  delStudentId: baseUrl + 'SuperAdminController/delStudentId/', // 删除学生
  getUserByClassId: baseUrl + 'GradeController/getUserByClassId', // 获取班级成员
  updateAdminMessage: baseUrl + 'SuperAdminController/updateAdminMessage', // 设置管理员
  PublishNews: baseUrl + 'PublishMessageController/PublishNews', // 发布通知
  getMessage: baseUrl + 'PublishMessageController/getMessage', // 获取通知接口
  uploadFiles: baseUrl + 'UserController/uploadFiles/2', // 用戶上传文件
  uploadSituationByUser: baseUrl + 'PublishMessageController/uploadSituationByUser', // 获取上传情况
  uploadSituationByDorm: baseUrl + 'PublishMessageController/uploadSituationByDorm', // 获取宿舍情况
  SeniorAdminFuzzySearchByName: baseUrl + 'SuperAdminController/SeniorAdminFuzzySearchByName', // 高级管理员根据姓名查看学生信息
  delGrade: baseUrl + 'SuperAdminController/delGrade/', // 删除班级
  getUserByAccount: baseUrl + 'UserController/getUserByAccount', // 根据学号获取班级或者密保
  StudentFuzzySearchByName: baseUrl + 'UserController/StudentFuzzySearchByName', // 通过文件名或者通知标题进行搜索
  getAllAdminFileByClassId: baseUrl + 'UserController/getAllAdminFileByClassId', // 前台获取所有文件
  getAllStudentFileByClassId: baseUrl + 'UserController/getAllStudentFileByClassId', // 管理员一键下载管理员上传的文件
  AdminFuzzySearchByName: baseUrl + 'UserController/AdminFuzzySearchByName', // 管理员搜索通知
  delMessage: baseUrl + 'PublishMessageController/delMessage', // 删除通知
  AdminGetMessage: baseUrl + 'PublishMessageController/AdminGetMessage' // 管理员获取通知
}

export default api
