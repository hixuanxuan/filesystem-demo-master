import React,{useState,useEffect} from 'react';
import FileTree from './components/FlleTree'
import TabList from './components/TabList'
import Editor from 'for-editor'
import './App.scss'
import './App.css'
import '../src/util/reset.css'
import fileHelper from './util/fileHelper'
import { message,Button } from 'antd';
import { clone } from '@babel/types';
import { type } from 'os';
import nedb from './util/nedb'
import store from './util/store'
import {withRouter} from 'react-router-dom'
const { remote } = window.require('electron');
const { join } =window.require('path');

//

//

//

// let datalist=[
//   {
//       title:'parent0',
//       key:'0-0',
//       isLeaf:false,
//       // children:[]
//   },
//   {
//       title:'parent1',
//       key:'1-0',
//       isLeaf:false,
//       children:[
//           {
//               title:'child1',
//               key:'1-0-0',
//               isLeaf:true,
//           },
//           {
//               title:'555',
//               key:'1-0-1',
//               isLeaf:true,
//           },
//           {
//             title:'999',
//             key:'1-0-2',
//             isLeaf:true,
//         }
//       ]
//   }
// ]

let fileTitle;
let selectKey;
let Type;
function App({history,location}) {
  const username = location.query.username;
  let datalist=store.get(username)
  console.log(datalist);
  const [key,setKey] = useState('');
  const [title,setTitle] = useState(null);
  const [value,setValue] = useState('');
  const [treeList,setTreeList]=useState(datalist);
  const [fileType,setFileType]=useState('file');
  const savedLocation=remote.app.getPath('documents');
  //组件加载的时候执行一次，判断是否登陆，没有登陆需要登陆
  // useEffect(()=>{
  //   console.log(history);
  //   history.push('/login');
  //   //判断是否登
  //   console.log(111);
  // },[])
  //value是文本初始化的内容
  /**
   * 确定点击的文件的类型
   * @param {String} newType 
   */
  const setSelectType=(newType)=>{
    setFileType(newType);
  }

  const openFile=()=>{

  }
  /**
   * 创建文件修改state内容
   * @param {*} newKey 
   * @param {*} fileName 
   */
  const createFile=(newKey,fileName)=>{
    console.log(newKey);
    //修改state中File的数据结构

    setTreeList((prev)=>{
      //prev 创建的情况，判断她是不是父节点，如果是那就是在他的节点下面一层创建
      //如果不是父节点，那就是在他的同级创建
      //
      return {

      }
    })
  }
  const reNameTitle=(newTitle)=>{
    setTitle(newTitle);
  }
  /**
   * 设置新点击的文章的key
   * @param {String} newKey 
   */
  const setKeyFunc=(newKey)=>{
    setKey(newKey);
  }
  /**
   * 界面里面显示的文章内容
   * @param {String} newValue 
   */
  const setArticalValue=(newValue)=>{
    console.log('我在改变文章内容')
    console.log(newValue);
    setValue(newValue);
  }
  //修改editor的内容
  const handleChange=(newvalue)=>{
    console.log(newvalue);
    setValue(newvalue);
  }
  /**
   * 创建文件夹
   */

  const createFolder=(newKey,folderName,isFile)=>{
    //判断当前有没有children，如果有，就在他的children下面添加节点，如果没有，
    //判断她自己是文件还是文件夹，isleaf是否是true
    //如果是true，那就是文件，在他的同级目录创建文件夹
    //如果是false，那就是文件夹，在他的chiledren下面创建文件夹
    //
    let treeListClone=JSON.parse(JSON.stringify(treeList));
    let thisList=treeListClone;
    let newTreeList = treeMap(treeListClone,newKey,isFile,folderName,thisList);   
    console.log('folder')
    console.log(newTreeList);
    console.log(store.get(username))
    // store.set({
    //   [username]:treeList
    // })
  }
  
  useEffect(()=>{
    console.log(`${title}改变了`)
    fileTitle=title;
    console.log(fileTitle)
  },[title])
  useEffect(()=>{
    console.log(`${key}改变了`)
    selectKey=key;
    console.log(key)
  },[key])
  useEffect(()=>{
    Type=fileType;
  },[fileType])
  useEffect(()=>{
    console.log('treelist改变啦');
    store.set({
      [username]:treeList
    })
    console.log(store.get(username))
  },[treeList])
  async function handleDeleteFile(){
    // console.log(fileType)
    //判断是文件还是文件夹，是文件夹需要删除该文件夹下面的所有文件
    if(Type==='file'){
      console.log( fileTitle );
      fileHelper.deleteFIles(join(savedLocation,`${fileTitle}.md`)).then(()=>{
        message.success('删除成功');
      });
      //遍历把删除的文件找到
      console.log('key'+selectKey);
    }else{
      //如果是文件夹删除的操作需要麻烦一些，删除这个文件下面的所有文件夹，首先要获得这个下面所有文件的title
    let arr =  handleGetItems();//要删除的名字集合
    console.log(arr);
    let flag;
    // for(let i=0;i<arr.length;i++){
    //   flag= await doDelete();
    // };
    // message.success('删除成功');
    }
    let cloneList=JSON.parse(JSON.stringify(treeList));
    let brotherList=cloneList;
    console.log('删除')
    handleDelBfs(cloneList,brotherList);
   
  }
   function  doDelete(name){
    fileHelper.deleteFIles(join(savedLocation,`${name}.md`)).then(()=>{
      // message.success('删除成功');
      console.log('success');
    });
  }
  const handleGetItems=()=>{
    //广度优先遍历
    let cloneList=JSON.parse(JSON.stringify(treeList));
    if(!cloneList||!cloneList.length)return;
    let stack=[];
    for(let i=0;i<cloneList.length;i++){
      stack.push(cloneList[i]);
    }
    let item;
    //目前问题，删除文件夹只能删除顶层，删除子层的文件夹会导致返回为空，且item.key===selectKey无法执行
    while(stack.length){
      item=stack.shift();
      if(item.key===selectKey){
        //？？？这里是否正确？？？ 
        console.log('选中啦')
       return  handleGetTitleArr(item.children);
      }
      if(item.children&&item.children.length){
        stack=stack.concat(item.children);
      }
    }
  }
   /**
  * 获得选中的文件的标题集合的数组
  * @param {Array} filterItem 
  */
  const handleGetTitleArr=(filterItem)=>{
    //获得标题的数组
    let titleArr=[];
    console.log(filterItem);
    let cloneList=JSON.parse(JSON.stringify(filterItem));
    let stack=[];
    for(let i=0;i<cloneList.length;i++){
      stack.push(cloneList[i]);
    }
    let item;
    while(stack.length){
      item=stack.shift();
      titleArr.push(item.title);
      if(item.children&&item.children.length){
        stack=stack.concat(item.children);
      }
    }
    console.log(titleArr)
    return titleArr;
  }
 const handleDelBfs=(list,brotherList)=>{
    for(let i=0;i<list.length;i++){
      if(list[i].key===selectKey){
        //如果找到这个结点就干掉结点
        list[i]={};
        setTreeList(brotherList);
        return;
      }else{
        //否则继续底柜
        if(list[i].children&&list[i].children.length>=0){
          handleDelBfs(list[i].children,brotherList);
        }
      }
    }
 } 

  const treeMap=(list,newKey,isFile,folderName,thisList,parent)=>{
    if(!parent){
      parent={};
    }
    
    for(let i=0;i<list.length;i++){
      if(list[i].key===key){
        //首先判断找到了点击的节点的定位
        // return  treeAddNode(item,list,folderName,newKey);
        if(list[i].children&&list[i].children.length>=0){
          //有children
          console.log('children')
          list[i].children.push({
            title:folderName,
            key:newKey,
            isLeaf:isFile
          })
            //没有children
            //是文件
          }else if(list[i].isLeaf){
            console.log('data');
            console.log(list[i])
            parent.children.push({
              title:folderName,
              key:newKey,
              isLeaf:isFile
            })
          }else{
            //是文件夹
            list[i].children=[];
            list[i].children.push({
              title:folderName,
              key:newKey,
              isLeaf:isFile
            });
          }
          console.log(thisList);
          setTreeList(thisList);
          // store.set({
          //   [username]:thisList
          // })
          return ;
          // setTreeList(list);
      }else if(list[i].children&&list[i].children.length>0){
        treeMap(list[i].children,newKey,isFile,folderName,thisList,list[i]);
      }
    }
  }

const handleSaveFile=()=>{
  fileHelper.writeFile(join(savedLocation,`${title}.md`),value).then(()=>{
      message.success("保存成功")
  })
}

  return (
    <div className="globle-wrapper">
     <FileTree treeList={treeList}
     createFile={createFile}
     openFile={openFile}
     handleDeleteFile={handleDeleteFile}
     reNameTitle={reNameTitle}
     setKeyFunc={setKeyFunc}
     setArticalValue={setArticalValue}
     createFolder={createFolder}
     setSelectType={setSelectType}
     ></FileTree>
    <div className="right-wrapper">
        <TabList title={title}></TabList>
        <Editor value={value} onChange={(value) => handleChange(value)} />
        <Button type="primary" onClick={handleSaveFile}>保存</Button>
    </div>

    </div>
  );
}

export default withRouter(App) ;
