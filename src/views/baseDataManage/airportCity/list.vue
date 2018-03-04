<template>
  <div class="app-container">
    <el-form class="form-container" :model="postForm" ref="postForm">
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="机场三字码" placement="top">
                    <el-form-item label-width="120px" label="机场三字码:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:50px;' v-model="listQuery.departCode">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="城市三字码" placement="top">
                    <el-form-item label-width="120px" label="城市三字码:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:50px;' v-model="listQuery.arriveCode">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>

                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="机场中文名" placement="top">
                    <el-form-item label-width="120px" label="机场中文名:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:50px;' v-model="listQuery.cabin">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="城市中文名" placement="top">
                    <el-form-item label-width="120px" label="城市中文名:" class="postInfo-container-item">
                      <el-input placeholder="" style='min-width:50px;' v-model="listQuery.airline">
                      </el-input>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
                <el-col :span="8" style="text-align: right;">
                  <el-button type="primary">查询</el-button>
                  <el-button type="info">添加</el-button>
                </el-col>
              </el-row>

            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <el-table :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border stripe style="width: 68%;margin: 0 auto;">
      <el-table-column
        prop="departCode"
        label="机场三字码"
        width="100">
      </el-table-column>
      <el-table-column
        prop="arriveCode"
        width="150"
        label="机场中文名">
      </el-table-column>
      <el-table-column
        prop="airline"
        label="城市三字码"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cabin"
        width="150"
        label="城市中文名">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary" size="mini">详情</el-button>
          <el-button @click="handleClick(scope.row)" type="primary" size="mini">修改</el-button>
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
          { value: 'NFD' }
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
    }
  }
</script>
