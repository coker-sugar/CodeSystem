
<template>
    <div @scroll="handleScroll">
  
    <el-table
      :data="clist"
      style="height:600px; overflow: auto;"
      :row-key="row => row.id"
      
    >
      <!-- Add your table columns here -->
      <el-table-column label="用户账号" prop="account" align="center"></el-table-column>
        <el-table-column label="反馈用户" prop="username" align="center"></el-table-column>
        <el-table-column label="项目地址" prop="project_url"  align="center"></el-table-column>
         <el-table-column label="项目名称" prop="project_name"  align="center"></el-table-column>
        <el-table-column label="反馈内容" prop="issue"  align="center"></el-table-column>
        <el-table-column label="操作"  align="center" width="150">
          <template slot-scope="scope">
            <el-button type="primary" @click="scope.row.red && output(scope.row) " size="small" v-show="!scope.row.err && scope.row.blue">通过</el-button>
             <el-button type="primary"  v-show="scope.row.green" size="small">已通过</el-button>
          
  
            <el-button type="danger" @click="scope.row.blue && rejectput(scope.row)" size="small" v-show="!scope.row.green && scope.row.red">拒绝</el-button>
            <el-button type="danger" v-show="scope.row.err" size="small">已拒绝</el-button>
  
          </template>
        </el-table-column>
    </el-table>
    
  </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        list: [],
        clist: [],
        itemH: 60,
        showNum: 10,
        offsetY: 0,
        lastTime: 0,
      };
    },
    mounted() {
      this.lastTime = new Date().getTime();
      this.getList();
    },
    methods: {
      getList() {
        this.$axios.get("/issue/get_feedback").then(res => {
          this.list.push(...JSON.parse(JSON.stringify(res.data)));
          this.updateClist(0);
        });
      },
      handleScroll(e) {
        if (new Date().getTime() - this.lastTime > 10) {
          let scrollTop = e.target.scrollTop;
          console.log(scrollTop);
          this.offsetY = scrollTop - (scrollTop % this.itemH);
  
          let startIndex = Math.floor(scrollTop / this.itemH);
          let endIndex = startIndex + this.showNum;
  
          this.updateClist(startIndex, endIndex);
          this.lastTime = new Date().getTime();
        }
      },
      updateClist(startIndex, endIndex) {
        if (startIndex < 0 || endIndex > this.list.length) {
          return;
        }
  
  
        this.clist = this.list.slice(startIndex, endIndex);
        console.log(this.clist);
      },
    },
  };
  </script>