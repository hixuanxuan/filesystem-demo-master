import React,{Fragment,useEffect,useRef,useState,forwardRef, useImperativeHandle,createRef} from 'react';
import { Tree } from 'antd';
import { is } from 'immutable';
import useContextMenu from '../hooks/useContextMenu'
import useWinSize from '../hooks/useWinSize'
import './FileTree.scss'
import { Modal, Button,message } from 'antd';
import WrappedNameForm from './NameForm'
import fileHelper from '../util/fileHelper'
const { confirm } = Modal;
const {remote} = window.require('electron');
const {Menu,MenuItem} =remote;
const { TreeNode, DirectoryTree } = Tree;
//require node.js modules
const {join} =window.require('path');
const uuid = require('uuid-v4');




const FileTree =({treeList,createFile,openFile,handleDeleteFile,reNameTitle,setKeyFunc,setArticalValue,createFolder,setSelectType})=> {
  // console.log(treeList)
  const [selectKey, setSelectKey] = useState('fileid');
  const [title, setTitle] = useState('file0');
  const [visiable,setVisiable] = useState(false);
  //写入文章的内容
  const [value,setValue] = useState('## hello world');
  //文件的保存路径
  const savedLocation=remote.app.getPath('documents');
  //创建的类型 文件还是文件夹
  const [type,setType] = useState('file');
  // let key='';
  //获取屏幕高度
 const size = useWinSize()
 const onSelect = (keys, info) => {
    console.log(info.node.props.title)
    setTitle(info.node.props.title);
    //通过父组件传来的方法修改组件的props
    reNameTitle(info.node.props.title);
    setSelectKey(keys[0]);
    setKeyFunc(keys[0]);
    if(info.node.props.isLeaf){
      setSelectType('file');
    }else{
      setSelectType('folder');
    }
   
    // setArticalValue
    //读取文章内容
    fileHelper.readFile(join(savedLocation,`${info.node.props.title}.md`)).then((data)=>{
      console.log(data);
      setArticalValue(data);
    })
    console.log('Trigger Select', keys[0]);
    // key=keys[0];
  };

 const onExpand = () => {
    console.log('Trigger Expand');
  };
  // const renderNode=({title,key,isLeaf})=>{
  //   console.log(title,key,isLeaf)
  //   //   })
  //   return (
  //       <TreeNode title={title} key={key} isLeaf={isLeaf} data-key={key}></TreeNode>
  //   )
  // }                                                                                                                                                                                                                                                                                                               
 const getNode=(nodeArr)=>{
  return nodeArr.map((item)=>{
        if(!item.children||item.children.length==0){
            //说明是叶子节点
            let {title,key,isLeaf} = item;
            return(
                <TreeNode title={title} key={key} isLeaf={isLeaf} data-key={key}></TreeNode>
            )
        }else{
            //说明是父节点
            return (
                <TreeNode title={item.title} key={item.key} data-key={item.key}>
                    {/* 否则递归 */
                        getNode(item.children)
                    }
                </TreeNode>
            )
        }
   })
}

//删除文件的弹窗交互
const showConfirm =() => {
  confirm({
    title: '您确定要删除文件嘛',
    content: 'Some descriptions',
    onOk() {
      //选择确认的回调
      console.log('OK');
      // fileHelper.deleteFiles(join(savedLocation,`${}.md`)).then(()=>{
      
      // })
      handleDeleteFile()
    },
    onCancel() {
      //取消的提示
      message.warning('您取消了删除操作');
      console.log('Cancel');
    },
  });
}
//新建文件的弹窗交互

const showCreateModal = () => {
  setVisiable(true);
};

const handleModalOk=(e)=>{
  console.log(e);
  setVisiable(false);
 const demo = formRef.current.form;
 console.log(demo);
  // let demo=this.refs.getFormVlaue;//通过refs属性可以获得对话框内form对象
  demo.validateFields((err, values) => {
    if(!err){
      console.log(values.fileName);//这里可以拿到数据
      console.log(selectKey);
      //values.fileName文件名字
      //判断是创建文件夹还是文件
      if(type==="folder"){
        createFolder(uuid(),values.fileName,false);
      }else{
        fileHelper.writeFile(join(savedLocation,`${values.fileName}.md`),value).then(()=>{
          createFolder(uuid(),values.fileName,true);
      })
      }
    }
  });
}

const handleModalCancel=(e)=>{
  console.log(e);
  setVisiable(false);
}

///end
/**
 * 打开文件操作的函数
 */
const openSelectFile=()=>{
   console.log(selectKey);
}
//end
  const clickItem = useContextMenu([
      {
        label:'open',
        click:()=>{
          // console.log(clickItem.current.dataset.key)
          openSelectFile();
        }
      },
      {
        label:'create folder',
        click:()=>{
        //  createFolder();
         setType('folder')
         showCreateModal();
        }
      },
      {
        label:'create single file',
        click:()=>{
          console.log('create');
          setType('file');
          showCreateModal();
        }
      },
      {
        label:'delete',
        click:()=>{
          //删除
          showConfirm();
        }
      }
    ],'.tree-inner-wrapper')

    const formRef = createRef();
    return (
    <>
    <div className="tree-wrapper" style={{height:size.height}}>
      <div className="tree-inner-wrapper">
      <DirectoryTree multiple defaultExpandAll onSelect={onSelect} onExpand={onExpand} >
        {/* <TreeNode title="parent 0" key="0-0">
            <TreeNode title="parent 1" key="0-0-1" >
            <TreeNode title="leaf 1-0" key="0-0-1-0" isLeaf />
            <TreeNode title="leaf 1-1" key="0-0-1-1" isLeaf />
            <TreeNode title="leaf 1-2" key="0-0-1-2" isLeaf />
            </TreeNode>
          <TreeNode title="leaf 0-0" key="0-0-0" isLeaf />
          <TreeNode title="leaf 0-1" key="0-0-2" isLeaf />
        </TreeNode>
        <TreeNode title="parent 1" key="0-1">
          <TreeNode title="leaf 1-0" key="0-1-0" isLeaf />
          <TreeNode title="leaf 1-1" key="0-1-1" isLeaf />
        </TreeNode> */}
        {
            getNode(treeList)
        }
      </DirectoryTree>
      </div>
    </div>
      <Modal
      title="Basic Modal"
      visible={visiable}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      >
      <WrappedNameForm 
       wrappedComponentRef={formRef}
      />
      </Modal>
    </>
    );
  }
// }

export default FileTree;