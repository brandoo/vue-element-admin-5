<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '+postForm.status">
        <template v-if="fetchSuccess">
          <router-link style="margin-right:15px;" v-show='isEdit' :to="{ path:'create-form'}">
            <el-button type="info">创建form</el-button>
          </router-link>
          <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm()">保存
          </el-button>
        </template>
        <template v-else>
          <el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <el-row class="border-bottom70">
          <el-col :span="21">
            <div class="postInfo-container">
              <h3>公司信息</h3>
              <el-row>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="公司名称" placement="top">
                    <el-form-item label-width="80px" label="公司名称:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:150px;' v-model="postForm.name">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row class="border-bottom70">
          <el-col :span="21">
            <div class="postInfo-container">
              <h3>联系方式</h3>
              <el-row>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="联系人姓名" placement="top">
                    <el-form-item label-width="90px" label="联系人姓名:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:150px;' v-model="postForm.contactName">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="手机" placement="top">
                    <el-form-item label-width="50px" label="手机:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:150px;' v-model="postForm.mobilePhone">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="固定电话" placement="top">
                    <el-form-item label-width="80px" label="固定电话:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:150px;' v-model="postForm.telephone">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row class="border-bottom70">
          <el-col :span="21">
            <div class="postInfo-container">
              <h3>账号信息</h3>
              <el-row>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="账户名" placement="top">
                    <el-form-item label-width="70px" label="账户名:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:150px;' v-model="postForm.username">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="密码" placement="top">
                    <el-form-item label-width="50px" label="密码:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:150px;' v-model="postForm.password">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row class="border-bottom70">
          <el-col :span="21">
            <div class="postInfo-container">
              <h3>权限管理</h3>
              <el-row>
                <el-col :span="15">
                  <el-form-item label-width="70px" label="接口权限" class="postInfo-container-item">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Search</el-checkbox>
                    <el-checkbox-group v-model="postForm.privilege.search" @change="handleCheckedCitiesChange">
                      <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                    </el-checkbox-group>

                    <el-checkbox :indeterminate="isFareIndeterminate" v-model="checkFareAll" @change="handleCheckFareAllChange">运价</el-checkbox>
                    <el-checkbox-group v-model="postForm.privilege.fare" @change="handleCheckedFaresChange">
                      <el-checkbox v-for="fare in fares" :label="fare" :key="fare">{{fare}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

      </div>
    </el-form>

  </div>
</template>

<script>
  import Sticky from '@/components/Sticky' // 粘性header组件
  import { userSearch } from '@/api/remoteSearch'
  import { fetchArticle } from '@/api/article'
  import { validateURL } from '@/utils/validate'

  const purchaser = {
    status: 'draft',
    openId: '',
    name: '',
    contactName: '',
    mobilePhone: '',
    telephone: '',
    username: '',
    password: '',
    privilege: {
      search: [],
      fare: []
    }
//    display_time: undefined, // 前台展示时间
//    platforms: ['a-platform'],
//    comment_disabled: false
  }
  const cityOptions = ['丝绸之路', '京杭', 'FD+AV', 'NFD+AV']
  const fareOptions = ['FD', 'NFD']

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
        postForm: Object.assign({}, purchaser),
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
        },
        checkAll: false,
        checkFareAll: false,
        checkedCities: ['上海', '北京'],
        checkedFares: ['FD'],
        cities: cityOptions,
        fares: fareOptions,
        isIndeterminate: true
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
        this.postForm = Object.assign({}, purchaser)
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
//        this.postForm.display_time = parseInt(this.display_time / 1000)
        console.log(this.postForm)
//        this.$refs.postForm.validate(valid => {
//          if (valid) {
//            this.loading = true
//            this.$notify({
//              title: '成功',
//              message: '发布文章成功',
//              type: 'success',
//              duration: 2000
//            })
//            this.postForm.status = 'published'
//            this.loading = false
//          } else {
//            console.log('error submit!!')
//            return false
//          }
//        })
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
      },
      handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : []
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange(value) {
        const checkedCount = value.length
        this.checkAll = checkedCount === this.cities.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .border-bottom70 {
    border-bottom: 1px solid #c6c4cb;
  }
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
