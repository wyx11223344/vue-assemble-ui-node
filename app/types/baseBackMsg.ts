/**
 * @author WYX
 * @date 2020/7/9
 * @Description: 基础返回msg文字
*/
export enum BaseErrorMsg {
    // 基础操作失败
    sqlError = '操作数据库失败，请检查参数和网络情况',
    redisError = 'redis缓存操作失败',
    paramsError = '参数传递出错',

    // 代码在线合成失败
    jsonError = '请输入正确的json对象',
    scriptError = 'script内部解析失败，请检查',
    lessError = 'less渲染失败，请检查less是否有位置参数等问题!',

    // npm包生成
    saveNpmName = '您已经发布过一个这个包了，请进行修改或重新创建新的包'
}

export enum BaseSuccessMsg {
    // npm包生成
    saveNpm = '成功添加构成任务，构建状态和详情请查看'
}
