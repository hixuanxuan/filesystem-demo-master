const fs=window.require('fs').promises;
const path=window.require('path');

const fileHelper={
    readFile:(path)=>{
        return fs.readFile(path,{encoding:'utf8'})
    },
    //写入哪个文件，写入的内容
    writeFile:(path,content)=>{
       return fs.writeFile(path,content,{encoding:'utf8'})
    },
    renameFile:(path,newPath)=>{
        return fs.rename(path,newPath)
    },
    deleteFIles:(path)=>{
        return fs.unlink(path);
    }
}
//获取helper.js在文件中的路径
const testPath=path.join(__dirname,'helper.js');
const testWritePath=path.join(__dirname,'helper.js')
const renamePath=path.join(__dirname,'hello.md')


export default fileHelper;
