<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <router-link style="margin-right:15px;" v-show='isEdit' :to="{ path:'create-form'}">
            <el-button type="info">创建form</el-button>
          </router-link>
          <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm()">查询
          </el-button>
          <router-link style="margin-left:15px;" :to="{ path:'create-account'}">
            <el-button v-loading="loading" type="info" @click="draftForm">添加账号</el-button>
          </router-link>
        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="客户名称" placement="top">
                    <el-form-item label-width="80px" label="客户名称:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:150px;' v-model="postForm.source_name">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="账户名" placement="top">
                    <el-form-item label-width="60px" label="账户名:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:150px;' v-model="postForm.source_name">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="账号状态" placement="top">
                    <el-form-item label-width="80px" label="账号状态:" class="postInfo-container-item">
                      <el-select placeholder="请选择" style='min-width:150px;' v-model="postForm.source_name">
                        <el-option
                          v-for="item in postForm.source_name"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <el-table :data="tableData" border stripe style="width: 98%;margin: 0 auto;">
      <el-table-column
        prop="name"
        label="客户名程"
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="账户名">
      </el-table-column>
      <el-table-column
        prop="date"
        label="注册日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary" size="mini">详情</el-button>
          <el-button @click="handleClick(scope.row)" type="primary" size="mini">修改</el-button>
          <el-button type="primary" size="mini">挂起</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { userSearch } from '@/api/remoteSearch'
  import { fetchArticle } from '@/api/article'
  import { validateURL } from '@/utils/validate'

  const defaultForm = {
    status: 'draft',
    title: '', // 文章题目
    content: '', // 文章内容
    content_short: '', // 文章摘要
    source_uri: '', // 文章外链
    image_uri: '', // 文章图片
    source_name: '', // 文章外部作者
    display_time: undefined, // 前台展示时间
    id: undefined,
    platforms: ['a-platform'],
    comment_disabled: false
  }

  export default {
    name: 'articleDetail',
    components: { Sticky },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(null)
        } else {
          callback()
        }
      }
      const validateSourceUri = (rule, value, callback) => {
        if (value) {
          if (validateURL(value)) {
            callback()
          } else {
            this.$message({
              message: '外链url填写不正确',
              type: 'error'
            })
            callback(null)
          }
        } else {
          callback()
        }
      }
      return {
        postForm: Object.assign({}, defaultForm),
        fetchSuccess: true,
        loading: false,
        userLIstOptions: [],
        platformsOptions: [
          { key: 'a-platform', name: 'a-platform' },
          { key: 'b-platform', name: 'b-platform' },
          { key: 'c-platform', name: 'c-platform' }
        ],
        rules: {
          image_uri: [{ validator: validateRequire }],
          title: [{ validator: validateRequire }],
          content: [{ validator: validateRequire }],
          source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
        },
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          username: '上海市普陀区金沙江路 1518 弄',
          status: 'aaa'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          username: '上海市普陀区金沙江路 1517 弄',
          status: 'aaa'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          username: '上海市普陀区金沙江路 1519 弄',
          status: 'aaa'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          username: '上海市普陀区金沙江路 1516 弄',
          status: 'aaa'
        }],
        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        }
      }
    },
    computed: {
      contentShortLength() {
        return this.postForm.content_short.length
      }
    },
    created() {
      if (this.isEdit) {
        this.fetchData()
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }
    },
    methods: {
      fetchData() {
        fetchArticle().then(response => {
          this.postForm = response.data
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      submitForm() {
        this.postForm.display_time = parseInt(this.display_time / 1000)
        console.log(this.postForm)
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.postForm.status = 'published'
            this.loading = false
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      draftForm() {
        if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
          this.$message({
            message: '请填写必要的标题和内容',
            type: 'warning'
          })
          return
        }
        this.$message({
          message: '保存成功',
          type: 'success',
          showClose: true,
          duration: 1000
        })
        this.postForm.status = 'draft'
      },
      getRemoteUserList(query) {
        userSearch(query).then(response => {
          if (!response.data.items) return
          console.log(response)
          this.userLIstOptions = response.data.items.map(v => ({
            key: v.name
          }))
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
