<template>
  <div style="width:80vw">
    <el-input
      v-model="input"
      placeholder="请输入内容"
      style="width: 200px"
      @keyup.enter.native="search"
    ></el-input>
    <el-button type="primary" style="margin-left: 20px" @click="search"
      >搜索</el-button
    >
  <el-upload
    style="display:inline-block;margin-left:2vw;"
     class="upload-demo"
     ref="upload"
     action="doUpload"
     :limit="1"
     :before-upload="beforeUpload">
     <el-button style="height:40px;border-radius:4px;font-size:14px;" slot="trigger" size="small" type="primary">上传文件</el-button>
  </el-upload> 

  <el-button 
  style="display:inline-block;margin-left:38vw;" 
  v-show = "serached"
  @click="download()" 
  type="primary" 
  size="large"
  >下载文件</el-button>

    <!-- 确认上传文件弹窗 -->
     <span slot="footer" class="upload-footer" v-show="confirmUpload">
        <div class="surface">
      <!-- <div slot="tip" class="el-upload__tip">注意：上传文件不得超过100MB</div> -->
     <div slot="tip" style="margin:20px">确认上传“{{NewfileName}} .{{filetxt}}”文件吗？</div>
     <el-button @click="cancleUpload()">取消</el-button>
     <el-button type="primary" @click="submitUpload()">确定</el-button>
        </div>
     </span>

    <div style="height:20px;width:100%;"></div>

    <!-- 标签 -->
    <el-row class="block-col-2">
      <el-col :span="6">
        <!-- <span class="demonstration">click 激活</span> -->
         <div class="tap" v-show="tap.lge">语言</div>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{language}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updateLanguage('C')">C</el-dropdown-item>
            <el-dropdown-item @click.native="updateLanguage('C#')">C#</el-dropdown-item>
            <el-dropdown-item @click.native="updateLanguage('python')">python</el-dropdown-item>
            <el-dropdown-item @click.native="updateLanguage('Java')">Java</el-dropdown-item>
            <el-dropdown-item @click.native="updateLanguage('JavaScript')">JavaScript</el-dropdown-item>
            <el-dropdown-item @click.native="updateLanguage('其它')">其它</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="7">
        <div class="tap" v-show="tap.ude">更新时间</div>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{time}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updateTime('一个月内')">一个月内</el-dropdown-item>
            <el-dropdown-item @click.native="updateTime('三个月内')">三个月内</el-dropdown-item>
            <el-dropdown-item @click.native="updateTime('半年内')">半年内</el-dropdown-item>
            <el-dropdown-item @click.native="updateTime('一年内')">一年内</el-dropdown-item>
            <el-dropdown-item @click.native="updateTime('三年内')">三年内</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
       <el-col :span="5">
        <div class="tap" v-show="tap.atn">关注度</div>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{attention}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updateAttention('1w+')">1w+</el-dropdown-item>
            <el-dropdown-item @click.native="updateAttention('1k+')">1K+</el-dropdown-item>
            <el-dropdown-item @click.native="updateAttention('100+')">100+</el-dropdown-item>
            <el-dropdown-item @click.native="updateAttention('其它')">其它</el-dropdown-item>
            <!-- <el-dropdown-item>三年内</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="6">
        <div class="tap" v-show="tap.les">点赞数</div>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{likes}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updateLikes('1w+')">1w+</el-dropdown-item>
            <el-dropdown-item @click.native="updateLikes('1k+')">1K+</el-dropdown-item>
            <el-dropdown-item @click.native="updateLikes('100+')">100+</el-dropdown-item>
            <el-dropdown-item @click.native="updateLikes('其它')">其它</el-dropdown-item>
            <!-- <el-dropdown-item>三年内</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>

     <div style="height:20px;width:100%;"></div>

    <div style="font-size:16px;text-indent:1em;color:#909399;">
      请选择你想要看到的项
      <el-button type="primary" size="mini" class="el-icon-menu" @click="wantSee()">选择</el-button>
    </div>
   
    <div class="select" v-show="select">
      <el-card style="width: 400px;" >
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCities">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
         </el-checkbox-group>
        <div style="text-align: center">
          <el-button type="primary" @click.native="cancelSelect">取消</el-button>
          <el-button type="primary" @click.native="confirmSelect">确 定</el-button>
        </div>
      </el-card>
    </div>

    <div style="height:20px;width:100%;"></div>

<!-- 显示搜索结果 -->
  <vxe-table
    style="width: 100%;"
    :data="pageTicket"
	  height="580"
	  :row-config="{isHover: true}"
	  :scroll-y="{enabled: true}"
    border>
    <vxe-column
      type="seq"
      width="60"
      title="序号"
      align = "center"
    ></vxe-column>
    <vxe-column
      width="120"
      field="project_name"
      title="项目名称"
      align = "center"
    >
    </vxe-column>
      <vxe-column
        field="keyword"
        title="语言"
        width="120"
        align="center"
        v-if="eltable.keyword">
      </vxe-column>
    <vxe-column
      field="project_url"
      title="项目地址"
      width="120"
      align="center"
      v-if="eltable.url">
    </vxe-column>
    <vxe-column
      field="download_url"
      title="下载链接"
      width="300"
      align="center"
      v-if="eltable.download">
    </vxe-column>
    <vxe-column
    field="watch_count"
      title="关注数量"
      width="120"
      align="center"
      v-if="eltable.watch">
    </vxe-column>
    <vxe-column
    field="fork_count"
      title="下载次数"
      width="120"
      align="center"
      v-if="eltable.fork">
    </vxe-column>
    <vxe-column
    field="star_count"
      title="点赞次数"
      width="120"
      align="center"
      v-if="eltable.star">
    </vxe-column>
    <vxe-column
    field="update_time"
      title="更新时间"
      width="120"
      align="center"
      v-if="eltable.update">
    </vxe-column>
    <vxe-column
    field="commit_count"
      title="提交数量"
      width="120"
      align="center"
      v-if="eltable.commit">
    </vxe-column>

    <vxe-column
      field="about_text"
      title="相关文档"
      width="300"
      show-overflow="ellipsis"
      align="center"
      v-if="eltable.about">
    </vxe-column>


    <vxe-column
    field="file_path"
      title="文件路径"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.file_path">
    </vxe-column>
    <vxe-column
    field="docstring"
      title="描述文本"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.docstring">
    </vxe-column>
    <vxe-column
    field="annotation_dec"
      title="注释文本"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.annotation_dec">
    </vxe-column>
    <vxe-column
    field="invoked_codeAPI"
      title="codeAPI列表"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.invoked_codeAPI">
    </vxe-column>
    <vxe-column
    field="file_content"
      title="PY文件的内容"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.file_content">
    </vxe-column>
    <vxe-column
    field="file_size"
      title="PY文件的大小"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.file_size">
    </vxe-column>
    <vxe-column
    field="code_line"
      title="PY文件的代码行数"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.code_line">
    </vxe-column>
    <vxe-column
    field="invoked_subcodeAPI"
      title="subcodeAPI列表"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.invoked_subcodeAPI">
    </vxe-column>
    <vxe-column
    field="get_time"
      title="从GitHub获取的时间"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.get_time">
    </vxe-column>
    <vxe-column
    field="tags_text"
      title="GitHub项目的tags内容"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.tags_text">
    </vxe-column>
    <vxe-column
    field="branch_type"
      title="GitHub项目的分支类型"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.branch_type">
    </vxe-column>
    <vxe-column
    field="branch_count"
      title="GitHub项目的分支数目"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.branch_count">
    </vxe-column>
    <vxe-column
    field="tag_count"
      title="GitHub项目的tag数目"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.tag_count">
    </vxe-column>
    <vxe-column
    field="other_file_path"
      title="other.md文件的路径"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.other_file_path">
    </vxe-column>
    <vxe-column
    field="other_md_content"
      title="other.md文件的内容"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.other_md_content">
    </vxe-column>
    <vxe-column
    field="main_file_path"
      title="readme.md文件的路径"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.main_file_path">
    </vxe-column>
    <vxe-column
    field="main_md_content"
      title="readme.md文件的内容"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.main_md_content">
    </vxe-column>
    <vxe-column
    field="docstring_keywords"
      title="描述文本的前10个关键词"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.docstring_keywords">
    </vxe-column>
    <vxe-column
    field="annotation_dec_keywords"
      title="注释文本的前10个关键词"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.annotation_dec_keywords">
    </vxe-column>
    <vxe-column
    field="update_year"
      title="GitHub项目的最后一次更新的年份"
      show-overflow="ellipsis"
      width="120"
      align="center"
      v-if="eltable.update_year">
    </vxe-column>


    <vxe-column
      title="操作"
      width="70"
      ref ="table"
      align="center">
      <template #default="{ rowIndex }">
        <vxe-button type="text" status="primary" round @click="editEvery(rowIndex)">编辑</vxe-button>
      </template>
    </vxe-column>
  </vxe-table>

  <!-- 控制页面条数 -->
  <el-row>
    <el-col style="text-align:right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentpage"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-col>
  </el-row>

<el-dialog title="编辑" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="项目名称" :label-width="formLabelWidth">
      <el-input v-model="form.project_name" autocomplete="off" disabled></el-input>
    </el-form-item>
    <el-form-item label="语言" v-if="eltable.keyword" :label-width="formLabelWidth">
      <el-input v-model="form.keyword" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="项目地址" v-if="eltable.url" :label-width="formLabelWidth">
      <el-input v-model="form.project_url" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="下载链接" v-if="eltable.download" :label-width="formLabelWidth">
      <el-input v-model="form.download_url" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="关注数量" v-if="eltable.watch" :label-width="formLabelWidth">
      <el-input v-model="form.watch_count" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="下载次数" v-if="eltable.fork" :label-width="formLabelWidth">
      <el-input v-model="form.fork_count" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="点赞次数" v-if="eltable.star" :label-width="formLabelWidth">
      <el-input v-model="form.star_count" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" v-if="eltable.update" :label-width="formLabelWidth">
      <el-input v-model="form.update_time" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="提交数量" v-if="eltable.commit" :label-width="formLabelWidth">
      <el-input v-model="form.commit_count" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>

    <!-- <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="相关文档" v-if="eltable.about" :label-width="formLabelWidth">
      <el-input v-model="form.about_text" autocomplete="off"></el-input>
    </el-form-item> -->
 
  </el-form>
  <div slot="footer" class="dialog-footer" >
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="FormVisible()">确 定</el-button>
  </div>
</el-dialog>


  </div>
</template>
<script>
import Request from '../../api/axios.js'
const cityOptions =  ['项目语言', '项目地址', '下载链接', '关注数量','下载次数','点赞次数','更新时间','提交数量','相关文档','文件路径','描述文本','注释文本','codeAPI列表','PY文件的内容','PY文件的大小','PY文件的代码行数','subcodeAPI列表','从GitHub获取的时间','GitHub项目的tags内容','GitHub项目的分支类型','GitHub项目的分支数目','GitHub项目的tag数目','other.md文件的路径','other.md文件的内容','readme.md文件的路径','readme.md文件的内容','描述文本的前10个关键词','注释文本的前10个关键词','GitHub项目的最后一次更新的年份'];
export default {
  data () {
    const chunkSize = 1 * 1024 * 1024;
    return {
      // 文件
      files:null,
      chunkSize, // 每片要上传的大小
      fileMd5, // md5对象
      fileName:"",
      NewfileName:"",
      filetxt:"",
      confirmUpload: false,
      serached:false,
      // 关键字
      input: '',
      // 搜索次数
      serachcount:0,
      // 从后端搜索的所有数据
      tableData:[
        {
          // 语言
          keyword: '***',
          // 项目名称
          project_name:'***',
          // 项目地址
          project_url:"****",
          // 下载链接
          download_url:"****",
          // 关注数量
          watch_count:"***",
          // 下载次数
          fork_count:"***",
          // 点赞次数
          star_count:"***",
          // 更新时间
          update_time:'*****',
          // 提交数量
          commit_count:'***',
          // 相关文档
          about_text:"***",

          // '文件路径',
          file_path:'',
          // '描述文本',
          docstring:"***",
          // '注释文本',
          annotation_dec:"***",
          // 'codeAPI列表',
          invoked_codeAPI:"***",
          // 'PY文件的内容',
          file_content:"***",
          // 'PY文件的大小',
          file_size:"***",
          // 'PY文件的代码行数',
          code_line:"***",
          // 'subcodeAPI列表',
          invoked_subcodeAPI:"***",
          // '从GitHub获取的时间',
          get_time:"***",
          // 'GitHub项目的tags内容',
          tags_text:"***",
          // 'GitHub项目的分支类型',
          branch_type:"***",
          // 'GitHub项目的分支数目',
          branch_count:"***",
          // 'GitHub项目的tag数目',
          tag_count:"***",
          // 'other.md文件的路径',
          other_file_path:"***",
          // 'other.md文件的内容',
          other_md_content:"***",
          // 'readme.md文件的路径',
          main_file_path:"***",
          // 'readme.md文件的内容',
          main_md_content:"***",
          // '描述文本的前10个关键词',
          docstring_keywords:"***",
          // '注释文本的前10个关键词',
          annotation_dec_keywords:"***",
          // 'GitHub项目的最后一次更新的年份'
          update_year:"***",

      }],
      total:0,  //总数据条数
      currentpage:1,  //当前所在页默认是第一页
      pagesize:10,  //每页显示多少行数据 默认设置为10
      itemNum: 0, // (currentpage-1) * pagesize
      pageTicket:[],//分页后的当前页数据
        // 标签显示
        tap: {
            lge:false,
            ude:false,
            atn:false,
            les:false
        },
        language: '语言',
        time:'更新时间',
        attention:'关注度',
        likes:'点赞数',
        // 发送标签
        deliverParams:{
          language: '语言',
          time:'更新时间',
          attention:'关注度',
          likes:'点赞数',
          key: this.input
        },
        // 选项框
        select:false,
        checkAll: false,  // 勾选全部时展示“√”
        keyvalue:[],
        checkedCities: [],
        cities:cityOptions, // 所有项
        isIndeterminate: true,  // 只勾选一部分项时显示 “-”
        eltable: {    //  决定展示哪些项
          keyword:true,
          url:true,
          download:true,
          watch:true,
          fork:true,
          star:true,
          update:true,
          commit:true,
          about:true,

          file_path:true,
          docstring:true,
          annotation_dec:true,
          invoked_codeAPI:true,
          file_content:true,
          file_size:true,
          code_line:true,
          invoked_subcodeAPI:true,
          get_time:true,
          tags_text:true,
          branch_type:true,
          branch_count:true,
          tag_count:true,
          other_file_path:true,
          other_md_content:true,
          main_file_path:true,
          main_md_content:true,
          docstring_keywords:true,
          annotation_dec_keywords:true,
          update_year:true,

        },
        dialogFormVisible: false,
        form:{},
        formLabelWidth: '120px'
    }
  },
  created(){
    // this.search()
  },
  mounted() {
    // this.search()
  },
methods: {
  wantSee(){
    this.select = !this.select
    // this.keyvalue =  ['项目语言', '项目地址','关注数量','下载次数']
    // 把所有的项不可见
    // for (let key in this.eltable) {
    //   if (this.eltable.hasOwnProperty(key)) {
    //   this.eltable[key] = false;
    //   }
    // }
    // for(let key in this.checkedCities) {
    //    if(this.checkedCities[key] == "项目语言") {
    //     this.eltable.keyword = true
    //   }else if (this.checkedCities[key] == "项目地址") {
    //     this.eltable.url = true
    //   }else if (this.checkedCities[key] == "下载链接") {
    //     this.eltable.download = true
    //   }else if (this.checkedCities[key] == "关注数量") {
    //     this.eltable.watch = true
    //   }else if (this.checkedCities[key] == "下载次数") {
    //     this.eltable.fork = true
    //   }else if (this.checkedCities[key] == "点赞次数") {
    //     this.eltable.star = true
    //   }else if (this.checkedCities[key] == "更新时间") {
    //     this.eltable.update = true
    //   }else if (this.checkedCities[key] == "提交数量") {
    //     this.eltable.commit = true
    //   }else if (this.checkedCities[key] == "相关文档") {
    //     this.eltable.about = true
    //   }
    // }
  },
  // 全选
   handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      // console.log(this.checkedCities)
      this.isIndeterminate = false;
      // if(this.checkedCities.length) {
      //   for (let key in this.eltable) {
      //     this.keyvalue[key] =true;
      //   }
      // }else{
      //    for (let key in this.eltable) {
      //     this.keyvalue[key] =false;
      // }
      // }
      if(this.checkedCities.length) {
        this.keyvalue = cityOptions
      }else{
        this.keyvalue = []
      }
  },

  handleCheckedCities(value) {
    this.keyvalue = value
  },
  handleCheckedCitiesChange(value) {
    // value勾选的项
    let checkedCount = value.length;
    this.checkAll = checkedCount === this.cities.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    for (let key in this.eltable) {
        if (this.eltable.hasOwnProperty(key)) {
         this.eltable[key] = false;
      }
    }
    for(let key in value) {
      if(value[key] == "项目语言") {
        this.eltable.keyword = true
      }else if (value[key] == "项目地址") {
        this.eltable.url = true
      }else if (value[key] == "下载链接") {
        this.eltable.download = true
      }else if (value[key] == "关注数量") {
        this.eltable.watch = true
      }else if (value[key] == "下载次数") {
        this.eltable.fork = true
      }else if (value[key] == "点赞次数") {
        this.eltable.star = true
      }else if (value[key] == "更新时间") {
        this.eltable.update = true
      }else if (value[key] == "提交数量") {
        this.eltable.commit = true
      }else if (value[key] == "相关文档") {
        this.eltable.about = true
      }
      
      else if (value[key] == "文件路径") {
        this.eltable.file_path = true
      } else if (value[key] == "描述文本") {
        this.eltable.docstring = true
      } else if (value[key] == "注释文本") {
        this.eltable.annotation_dec = true
      } else if (value[key] == "codeAPI列表") {
        this.eltable.invoked_codeAPI = true
      } else if (value[key] == "PY文件的内容") {
        this.eltable.file_content = true
      } else if (value[key] == "PY文件的大小") {
        this.eltable.file_size = true
      } else if (value[key] == "PY文件的代码行数") {
        this.eltable.code_line = true
      } else if (value[key] == "subcodeAPI列表") {
        this.eltable.invoked_subcodeAPI = true
      }else if (value[key] == "从GitHub获取的时间") {
        this.eltable.get_time = true
      } else if (value[key] == "GitHub项目的tags内容") {
        this.eltable.tags_text = true
      } else if (value[key] == "GitHub项目的分支类型") {
        this.eltable.branch_type = true
      } else if (value[key] == "GitHub项目的分支数目") {
        this.eltable.branch_count = true
      } else if (value[key] == "GitHub项目的tag数目") {
        this.eltable.tag_count = true
      } else if (value[key] == "other.md文件的路径") {
        this.eltable.other_file_path = true
      } else if (value[key] == "other.md文件的内容") {
        this.eltable.abother_md_contentout = true
      } else if (value[key] == "readme.md文件的路径") {
        this.eltable.main_file_path = true
      } else if (value[key] == "readme.md文件的内容") {
        this.eltable.main_md_content = true
      } else if (value[key] == "描述文本的前10个关键词") {
        this.eltable.docstring_keywords = true
      } else if (value[key] == "注释文本的前10个关键词") {
        this.eltable.annotation_dec_keywords = true
      } else if (value[key] == "GitHub项目的最后一次更新的年份") {
        this.eltable.update_year = true
      }
    }
 },

 cancelSelect(){
   this.select = !this.select
    // for (let key in this.eltable) {
    //     if (this.eltable.hasOwnProperty(key)) {
    //      this.eltable[key] = true;
    //   }
    // }
    // this.checkedCities =  ['项目语言', '项目地址','关注数量','下载次数']
 },

 confirmSelect(){
    var _ = this
    const pro =  new Promise((resolve,reject) => {
        setTimeout(() => {
          _.select = !_.select
          resolve()
        },100)
    })
    pro.then(()=> {
      _.handleCheckedCitiesChange(_.keyvalue) 
    })
    return pro
 },
 
 // 计算md5 的值
  getFileMd5(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader()
            fileReader.onload = function (event) {
                let fileMd5 = this.$md5.ArrayBuffer.hash(event.target.result)
                resolve(fileMd5)
            }
            fileReader.readAsArrayBuffer(file)
        })
    },
  // 对上传的文件进行筛选
  beforeUpload(file) {
    this.files = file;
    const allowedExtensions = ['zip', 'xls', 'xlsx', 'docx', 'doc', 'jpg', 'jpeg', 'png', 'gif','pdf','sql'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isAllowedExtension = allowedExtensions.includes(fileExtension);
    const isSizeValid = file.size / 1024 / 1024 < 100;
  
    if (!isAllowedExtension) {
      this.$message.warning('文件格式不正确！');
      return false;
    }
    getFileMd5(file).then(md5 => {
      this.fileMd5 = md5
    })
    this.fileName = file.name.split('.')[0];

    const maxLength = 12;
    if (this.fileName.length <= maxLength) {
       this.NewfileName = this.fileName
    } else {
       this.NewfileName = this.fileName.slice(0, maxLength) + "...";
    }
    this.filetxt = file.name.split('.')[1]
     this.confirmUpload = !this.confirmUpload
    return false; // 返回 false 不会自动上传
  },

  // 取消文件上传
  cancleUpload() {
      this.files = null;
      this.fileName = "";
      this.confirmUpload = !this.confirmUpload;
  },

  submitUpload() {
    this.confirmUpload = !this.confirmUpload
    console.log('上传'+this.files.name)
    if(this.fileName == ""){
      this.$message.warning('请选择要上传的文件！')
      return false
    }
    this.files.forEach((e,i) => {
      let fileFormData = new FormData();
      fileFormData.append('totalNumber',this.files.length);
      fileFormData.append('chunkSize',this.chunkSize);
      fileFormData.append('index',i);
      fileFormData.append('md5', this.fileMd5);
      fileFormData.append('file', this.files);
      fileFormData.append('file',new File([e],this.files.name));//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      Request.sendFile(fileFormData).then((res)=> {
        if (res.status === 200) {
            //   this.$message({
            //     message: '上传成功',
            //     type: 'success',
            //     duration: 1500,
            // })
        } else {
          this.$message.error(res.status)
        }
      })
    })

    this.$axios.post("/file/checkFile").then((res) =>{
      if(this.fileMd5 == res.data.fileMd5) {
            this.$message({
                message: '上传成功',
                type: 'success',
                duration: 1500,
            })
      } else {
        this.$message.error(res.status)
      }
    })
    
  // this.$axios.post("/file/upload",fileFormData).then((res) => {
  //   if (res.status === 200) {
  //     this.$message({
  //     message: '提交成功',
  //     type: 'success',
  //     duration: 1500,
  //   })
  //  } else {
  //  this.$message.error(res.status)
  //  }
  // }) 
  },

    updateLanguage(language){
      this.language = language
      this.deliverParams.language = language
      this.tap.lge = true
      if(this.input && this.serachcount>0) {
        this.search()
      }
    },

    updateTime(time) {
      this.time = time
      this.deliverParams.time = time
      this.tap.ude = true
      if(this.input && this.serachcount>0) {
        this.search()
      }
    },

    updateAttention(attention){
      this.attention = attention
      this.deliverParams.attention = attention
      this.tap.atn = true
      if(this.input && this.serachcount>0) {
        this.search()
      }
    },

    updateLikes(likes){
      this.likes = likes
      this.deliverParams.likes = likes
      this.tap.les = true
      if(this.input && this.serachcount>0) {
        this.search()
      }
    },

     search () {
      let that = this
      this.loading = true
      this.deliverParams.key = this.input
      if( !this.deliverParams.key) {
        this.deliverParams.key = JSON.parse(window.localStorage.getItem("searchRecord"));
      }
      const formattedDate =  new Date().toISOString().substr(0, 10); // 输出: 2023-08-04

      window.localStorage.setItem("searchRecord", JSON.stringify(this.deliverParams.key))
      // this.$axios.get('http://127.0.0.1:4523/m1/3171021-0-default/edit',{
        Request.Search({
        language: this.deliverParams.language,
        time: this.deliverParams.time,
        attention: this.deliverParams.attention,
        likes: this.deliverParams.likes,
         key: this.deliverParams.key,
         nowtime: formattedDate,
         
         page:this.currentpage,
         info_number:this.pagesize
       }).then(response => {
          if(!response.data) {
            alert("未查询到数据")
            this.tableData = []
            setTimeout( ()=>{
              this.serached = false
            },500)
          }else {
          // console.log(response.data.code_info);
            this.pageTicket=[];
          // this.itemNum = (this.currentPage - 1) * this.pageSize
            // this.tableData = Array(this.itemNum).prototype.fill({ value:1 });
            // this.tableData.splice(this.itemNum,0,response.data.code_info)
            // this.tableData = this.tableData.flat(Infinity);

            this.pageTicket.push(response.data.code_info)
            this.pageTicket = this.pageTicket.flat(Infinity);
            console.log(this.pageTicket);

            // 分段渲染到table上面
            // this.total = response.data.length;
            // const startIndex = (this.currentPage - 1) * this.pagesize;
            // const endIndex = startIndex + this.pagesize;
            // this.pageTicket = response.data.slice(startIndex, endIndex).flat(Infinity);

            // console.log(this.pageTicket);
            // 获取数据的总长度
            that.total=response.data.length;

           //获取当前页的数据
            // that.getPageInfo();       //在这里调用获取当前页的数据信息方法
            // 延迟显示下载文件按钮
            setTimeout( ()=>{
              this.serached = true
            },500)
          }
          this.serachcount ++
          }).catch(resp => {
          console.log("请求失败：" + resp.status + "," + resp.statusText);
        });
    },
   
    // 获取当前页的数据信息
  // getPageInfo(){
  //     //清空pageTicket中的数据
  //     this.pageTicket=[];
  //     // 获取当前页的数据
  //     for(let i=(this.currentpage-1)*this.pagesize;i<this.total;i++){
  //       //把遍历的数据添加到pageTicket里面
  //        this.pageTicket.push(this.tableData[i]);
  //       //判断是否达到一页的要求
  //       if(this.pageTicket.length===this.pagesize) break;
  //     }
	// },
    //分页时修改每页的行数,这里会自动传入一个size
    handleSizeChange(size){
      //修改当前每页的数据行数
      this.pagesize=size;
      this.search()
      //数据重新分页
      // this.getPageInfo();
    },
    //调整当前的页码
    handleCurrentChange(pageNumber){
      //修改当前的页码
      this.currentpage=pageNumber;
      this.search()

      //数据重新分页
      // this.getPageInfo()
  },

  // 下载文件
    download() {
      console.log(this.eltable)
      this.$axios.post('/file/select_status',{
          keyword:this.eltable.keyword,
          url:this.eltable.url,
          download:this.eltable.download,
          watch:this.eltable.watch,
          fork:this.eltable.fork,
          star:this.eltable.star,
          update:this.eltable.update,
          commit:this.eltable.commit,
          about:this.eltable.about,

          file_path:this.eltable.file_path,
          docstring:this.eltable.docstring,
          annotation_dec:this.eltable.annotation_dec,
          invoked_codeAPI:this.eltable.invoked_codeAPI,
          file_content:this.eltable.file_content,
          file_size:this.eltable.file_size,
          code_line:this.eltable.code_line,
          invoked_subcodeAPI:this.eltable.invoked_subcodeAPI,
          get_time:this.eltable.get_time,
          tags_text:this.eltable.tags_text,
          branch_type:this.eltable.branch_type,
          branch_count:this.eltable.branch_count,
          tag_count:this.eltable.tag_count,
          other_file_path:this.eltable.other_file_path,
          other_md_content:this.eltable.other_md_content,
          main_file_path:this.eltable.main_file_path,
          main_md_content:this.eltable.main_md_content,
          docstring_keywords:this.eltable.docstring_keywords,
          annotation_dec_keywords:this.eltable.annotation_dec_keywords,
          update_year:this.eltable.update_year,

          pagesize:this.pagesize,
          currentpage:this.currentpage
      }
      ).then(res => {
        console.log(res)
      }).catch(resp => {
          console.log(resp)
      })
      
      this.$axios.post("/file/download",
        this.tableData
      ).then(res => {
        console.log(res.data)
        window.location.href=res.data
        // setTimeout('console.clear()', 300)
      }).catch( resp =>{
          console.log(resp)
      })

       const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
    },

    editEvery(index){
      this.dialogFormVisible = true

      const formattedDate =  new Date().toISOString().substr(0, 10); 
      // this.$axios.get('http://127.0.0.1:4523/m1/3171021-0-default/edit',{
      this.$axios.post('/Code_Info/select',{
        language: this.deliverParams.language,
        time: this.deliverParams.time,
        attention: this.deliverParams.attention,
        likes: this.deliverParams.likes,
         key: this.deliverParams.key,
         nowtime: formattedDate,

         page:this.currentpage,
         info_number:this.pagesize
       }).then(response => {
          // console.log(response)
          this.form = response.data.code_info[index]  
        })
    },

    FormVisible() {
      this.dialogFormVisible = false
      this.form.time =  new Date().toISOString().substr(0, 10);
      this.$axios.post("/Code_Info/alter",{
        keyword: this.form.keyword,

        project_name: this.form.project_name,
        project_url: this.form.project_url,
        download_url: this.form.download_url,

        watch_count: this.form.watch_count,
        fork_count: this.form.fork_count,
        star_count: this.form.star_count,

        update_time: this.form.update_time,
        commit_count: this.form.commit_count,
        about_text: this.form.about_text,

        file_path:this.eltable.file_path,
        docstring:this.eltable.docstring,
        annotation_dec:this.eltable.annotation_dec,
        invoked_codeAPI:this.eltable.invoked_codeAPI,
        file_content:this.eltable.file_content,
        file_size:this.eltable.file_size,
        code_line:this.eltable.code_line,
        invoked_subcodeAPI:this.eltable.invoked_subcodeAPI,
        get_time:this.eltable.get_time,
        tags_text:this.eltable.tags_text,
        branch_type:this.eltable.branch_type,
        branch_count:this.eltable.branch_count,
        tag_count:this.eltable.tag_count,
        other_file_path:this.eltable.other_file_path,
        other_md_content:this.eltable.other_md_content,
        main_file_path:this.eltable.main_file_path,
        main_md_content:this.eltable.main_md_content,
        docstring_keywords:this.eltable.docstring_keywords,
        annotation_dec_keywords:this.eltable.annotation_dec_keywords,
        update_year:this.eltable.update_year,
        }).then(res=>{
          this.tableData[0] = this.form
            console.log(res);
        })
        this.search()
      this.form = {}
    }
  }
}
</script>

<style scoped>
  .block-col-2 {
    margin-left: 20px;
    width:50vw;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .tap {
    display: inline-block;
    margin-right: 10px;
    color: #409EFF;
    font-size: 14px;
  }
  .upload-footer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
    z-index:999;
  }
.surface {
   background-color: white;
  width: 300px;
  height: 140px;
  text-align: center;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* 灰色阴影 */
}
.select {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index:999;
}

</style>