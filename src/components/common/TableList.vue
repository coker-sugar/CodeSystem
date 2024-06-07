<template>
    <div>
      <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
          :data="tableData"
          @selection-change="handleSelectionChange"
      >
        <!--多选-->
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <!--序号-->
        <el-table-column
            type="index"
            :index="calIndex"
        >
        </el-table-column>
        <!--插槽处理-->
        <template v-for="(column,key) in tableObj.columns">
          <el-table-column
              :key="key"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              v-if="column.type == 'slot'"
          >
            <template slot-scope="scope">
              <slot :name="column.slot_name" :row="scope.row"></slot>
            </template>
          </el-table-column>
          
          <el-table-column
              :key="key"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              v-else-if="!column.hide"
          >
          </el-table-column>
        </template>
      </el-table>
      <div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableObj.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="tableObj.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableObj.total">
        </el-pagination>
      </div>
  
    </div>
  </template>
  
  <script>
  
  import request from "../../api/axios";
  
  export default {
    name: "H3yunTableCompV1",
    data() {
      return {
        // 表格对象   -- 1
        tableObj: {
          http: {
            url: undefined,
            params: {},
            result: {
              list: undefined,
              total: undefined
            }
          },
          pageNum: 1,
          pageSize: 10,
          total: 0,
          columns: []
        },
        tableData: []
      }
    },
    // 接收父组件传递过来的值
    props: {
      // 接收父组件传递过来的data数据，类型为Object   -- 2
      data: Object
    },
    watch: {
      // 监控父组件中的data，保证子组件中的tableObj与父组件一致   -- 3
      data: {
        deep: true, // 深度监控
        immediate: true, // 在组件创建时立即触发
        handler(newVal, oldVal) {
          this.init(newVal) // 初始化
        }
      }
    },
    // 挂载之前加载数据
    beforeMount() {
      this.load()
    },
    methods: {
      // 计算序号
      calIndex(index) {
        return (this.tableObj.pageNum - 1) * (this.tableObj.pageSize) + index + 1
      },
      // 构建查询参数
      buildParams() {
        const params = this.tableObj.http.params
        params.pageNum = this.tableObj.pageNum
        params.pageSize = this.tableObj.pageSize
        return params
      },
      // 解析构建结果 - 为了适配 list: 'data.records'，做一下处理
      buildResult(data, key) {
        const keys = key.split('.')
        let res = data
        for (const key of keys) {
          res = res[key]
  
        }
        return res
      },
      // 加载后端数据
      load() {
        // request对axios进行了一层封装
        request.post(this.tableObj.http.url, this.buildParams()).then(pageObj => {
          // 后端返回结果，需要的字段在哪不写死
          this.tableData = this.buildResult(pageObj, this.tableObj.http.result.list)
          this.tableObj.total = this.buildResult(pageObj, this.tableObj.http.result.total)
        })
      },
      // 更改每页数量
      handleSizeChange(val) {
        this.tableObj.pageSize = val
        this.tableObj.pageNum = 1
        this.load()
      },
      // 页码切换
      handleCurrentChange(val) {
        this.tableObj.pageNum = val
        this.load()
      },
      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 初始化方法   -- 4
      init(newVal) {
        for (const key in newVal) {
          // 如果父组件传的值能与tableObj的属性匹配，比如父子组件都有tableObj.columns，则会进入这个if
          if (Object.keys(this.tableObj).includes(key)) {
            // 比如：tableObj.columns = newVal.columns
            this.tableObj[key] = newVal[key]
          }
        }
  
      }
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  
  
  