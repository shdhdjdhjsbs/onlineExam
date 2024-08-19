<script setup lang="ts">
import { getPageMsgService, subMsgService, subCommentService } from '@/api/students';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue'
const input = ref<string>('')
const textarea = ref<string>('')
const dialogVisible = ref<boolean>(false)
const comment = ref<string>('')
const messageId = ref<string>('')
const params = ref({
    currentPage: 1,
    pageSize: 2,
    total: 1
})
type MsgRecord = {
    title: string;
    content: string;
    time: string;
    id: string;
    replays: { replay: string }[];
}
//分页留言数据
const pageMsgData = ref<MsgRecord[]>([])
onMounted(async () => {
    await onChangePage()
})
const handleSizeChange = (e:number) => {
    params.value.pageSize = e
    onChangePage()
}
const handleCurrentChange = (e:number) => {
    params.value.currentPage = e
    onChangePage()
}

// 日期格式化
const formattedDate = ref('')
const FormattedDate = () => {
    let date = new Date()
    formattedDate.value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// 提交留言
const subMsg = async () => {
    FormattedDate()
    if (input.value.length == 0 || textarea.value.length == 0) { //非空判断
        ElMessage({
            type: 'error',
            message: '留言标题或内容不能为空',
        })
        return
    }
    await subMsgService(input.value, textarea.value, formattedDate.value)
    await onChangePage()
    input.value = ''
    textarea.value = ''
}

// 回复留言
const subComment = async () => {
    if (comment.value.length == 0) { //非空判断
        ElMessage({
            type: 'error',
            message: '留言不能为空，请重新输入',
        })
        return
    }
    dialogVisible.value = !dialogVisible
    FormattedDate()
    await subCommentService(comment.value,formattedDate.value,messageId.value)
    await onChangePage()
}
const onChangePage = async () => {
    const res = await getPageMsgService(params.value.currentPage, params.value.pageSize)
    pageMsgData.value = res.data.data.records
    params.value.total = res.data.data.total
    console.log(pageMsgData.value);
}
// 打开对话框和储存消息的id
const OpendialogVisible= (e:string) => {
    dialogVisible.value = !dialogVisible.value
    messageId.value = e
}
</script>
<template>
    <keep-alive>
        <navigation></navigation>
    </keep-alive>
    <div class="msgBoardBox">
        <div class="title center">给我留言</div>
        <div class="main">
            <el-input v-model="input" style="width: 95%" placeholder="留言标题" size="large" clearable />
            <el-input v-model="textarea" style="width: 95%" :autosize="{ minRows: 4, maxRows: 6 }" type="textarea"
                placeholder="留言内容" />
            <div class="btnBox">
                <div class="btn center" @click="subMsg">提交留言</div>
            </div>
            <el-dialog v-model="dialogVisible" title="回复留言" width="400">
                <el-input v-model="comment" style="width: 95%" placeholder="回复内容" size="large" clearable />
                <div class="center"><el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="subComment">
          确认回复
        </el-button></div>
            </el-dialog>
            <div class="msgContent">
                <div class="msg" v-for="item in pageMsgData" key="item">
                    <div class="msgTitle center"><el-icon>
                            <Promotion />
                        </el-icon>{{ item.title }}</div>
                    <div class="content">
                        {{ item.content }}
                    </div>
                    <div class="msgTime center">
                        <div class="center"><el-icon>
                                <Timer />
                            </el-icon>{{ item.time }}</div>
                        <div class="comment center" @click="OpendialogVisible(item.id)">回复</div>
                    </div>
                    <div class="msgReplay" v-for="item1 in item.replays" key="item1"><el-icon>
                            <ChatDotRound />
                        </el-icon>
                        <div class="text">
                            {{ item1.replay }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="paging center"><el-pagination v-model:current-page="params.currentPage"
                    v-model:page-size="params.pageSize" :page-sizes="[1, 2]"
                    layout="total, sizes, prev, pager, next, jumper" :total="params.total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" /></div>
        </div>
    </div>
</template>
<style scoped>
::v-deep .el-input--large .el-input__wrapper {
    margin: 15px 0 15px 0;

}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.msgBoardBox {
    width: 100%;
    height: 92vh;
    background-color: rgb(238, 238, 238);
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.title {
    width: 100%;
    height: 6vh;
}

.main {
    border-radius: 10px;
    display: flex;
    height: 81vh;
    width: 65%;
    background-color: rgb(255, 255, 255);
    /* flex-wrap: wrap; */
    margin-bottom: 10vh;
    flex-direction: column;
    /* justify-content: space-between; */
    align-items: center;
}

.btnBox {
    width: 95%;
    height: 6vh;
    margin: 15px 0 10px 0;
}

.btn {
    height: 6vh;
    width: 12%;
    border-radius: 5px;
    color: white;
    background-color: rgb(64, 158, 255);
}

.msgContent {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.msg {
    border-radius: 5px;
    margin-top: 5px;
    width: 95%;
    background-color: rgb(238, 238, 238);
}

.msgTitle {
    width: 100%;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: 1vh 1vh 1vh 2vh;
}

.content {
    width: 100%;
    box-sizing: border-box;
    padding: 0 2vh 0 2vh;
    justify-content: flex-start;
    word-wrap: break-word;
    /* 允许在单词内部进行换行 */
    white-space: normal;
    /* 正常换行 */
}

.msgTime {
    width: 100%;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 1vh 1vh 1vh 2vh;
    color: rgb(80, 157, 209);
}

.comment {
    height: 3vh;
    border-radius: 5px;
    width: 8vh;
    color: white;
    background-color: rgb(64, 158, 255);
    margin-right: 10px;
}

.msgReplay {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: 0 2vh 1vh 2vh;
    color: rgb(40, 178, 180);
}

.msgReplay .text {
    word-wrap: break-word;
    /* 允许在单词内部进行换行 */
    white-space: normal;
    /* 正常换行 */
    flex: 1;
    /* 占据剩余空间， */
    min-width: 0;
    /* 确保 flex 项目在容器中溢出时能正确换行 */
}

.paging {
    position: absolute;
    bottom: 7vh;
}
</style>