import instance from '../utils/instance'

function POST(url,data) {
    return instance.post(
        url,
        JSON.parse(JSON.stringify(data))
        ,{ 
            headers: { "Content-Type": "application/json" } //覆盖请求头
        } 
    )
}

function GET(url,data) {
    return instance.get(
        url,
        JSON.parse(JSON.stringify(data))
        ,{ 
            headers: { "Content-Type": "application/json" } //覆盖请求头
        } 
    )
}

function Login(data) {
    return GET('http://127.0.0.1:4523/m1/3171021-0-default/login',data)
}

function Submit(data) {
    return POST('/CodeRepository/signup',data)
}

function getUserAll() {
    return GET('/CodeRepository/getAll',{})
}

function getUser(data) {
    return POST("/CodeRepository/login",data)
}

function setInfo(data) {
    return POST("/CodeRepository/set_info",data)
}

function Upload(data) {
    return POST("/file/upload",data)
}

function Search(data) {
    return POST('/Code_Info/select',data)
}

function sendFile(data) {
    return post('/file/upload',data)
}

const Request = {
    Login,
    Submit,
    getUserAll,
    getUser,
    setInfo,
    Upload,
    Search,
    sendFile
}

export default Request