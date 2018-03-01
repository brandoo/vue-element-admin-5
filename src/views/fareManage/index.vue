<template>
  <div class="app-container">
    <!--<div style="margin-bottom:15px;">你的权限： {{roles}}</div>-->
    <!--切换权限：-->
    <!--<el-radio-group v-model="role">-->
      <!--<el-radio-button label="editor"></el-radio-button>-->
    <!--</el-radio-group>-->
    <el-form class="form-container" :model="postForm" ref="postForm">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="出发地三字码" placement="top">
                    <el-form-item label-width="120px" label="出发地三字码:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:50px;' v-model="listQuery.departCode">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="目的地三字码" placement="top">
                    <el-form-item label-width="120px" label="目的地三字码:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:50px;' v-model="listQuery.arriveCode">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="运价源" placement="top">
                    <el-form-item label-width="80px" label="运价源:" class="postInfo-container-item">
                      <el-select placeholder="请选择" style='min-width:150px;' v-model="listQuery.fareSource">
                        <el-option
                          v-for="item in fareSource"
                          :key="item.value"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="航司" placement="top">
                    <el-form-item label-width="120px" label="航司:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:50px;' v-model="listQuery.airline">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="舱位" placement="top">
                    <el-form-item label-width="120px" label="舱位:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:50px;' v-model="listQuery.cabin">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8" style="text-align: right;">
                  <el-button type="primary">查询</el-button>
                </el-col>
              </el-row>

            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border stripe style="width: 98%;margin: 0 auto;">
      <el-table-column
        prop="departCode"
        label="出发机场三字码"
        width="100">
      </el-table-column>
      <el-table-column
        prop="arriveCode"
        width="100"
        label="目的机场三字码">
      </el-table-column>
      <el-table-column
        prop="airline"
        label="航司"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cabin"
        width="100"
        label="舱位">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="100">
      </el-table-column>
      <el-table-column
        prop="fareSource"
        width="100"
        label="运价源">
      </el-table-column>
      <el-table-column
        prop="crawlTime"
        label="爬取时间"
        width="160">
      </el-table-column>
      <el-table-column
        prop="fareValidStartTime"
        width="160"
        label="运价有效起始时间">
      </el-table-column>
      <el-table-column
        prop="fareValidEndTime"
        label="运价有效截止时间"
        width="160">
      </el-table-column>
      <el-table-column
        prop="aheadIssueDay"
        width="100"
        label="提前开票天数">
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
import { fetchList } from '@/api/fareManage'
import { mapGetters } from 'vuex'

export default{
  name: 'permission',
  data() {
    return {
      listLoading: true,
      list: null,
      total: null,
      postForm: {},
      fareSource: [
        { value: 'FD' },
        { value: 'NFD' },
      ],
      listQuery: {
        page: 1,
        limit: 20,
        departCode: undefined,
        arriveCode: undefined,
        fareSource: [],
        airline: undefined,
        cabin: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      })
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  watch: {
    role(val) {
      this.$store.dispatch('ChangeRole', val).then(() => {
        this.$router.push({ path: '/permission/index?' + +new Date() })
      })
    }
  }
}
</script>
