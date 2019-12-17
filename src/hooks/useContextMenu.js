import {useEffect,useRef} from 'react';
const {remote} = window.require('electron');
const {Menu,MenuItem} =remote;

const useContextMenu=(itemArr,targetSelector)=>{
    let clickElement=useRef(null);
    useEffect(()=>{
        const menu=new Menu();
        itemArr.forEach((item)=>{
            menu.append(new MenuItem(item));
        })
        const handleContextMenu=(e)=>{
            //判断是否是我们要的区域点击 也就是targrtselector包含我们点击的dom
            if(document.querySelector(targetSelector).contains(e.target)){
                clickElement.current=e.target;
                menu.popup({window:remote.getCurrentWindow()})
            }
        }
        window.addEventListener('contextmenu',handleContextMenu);
        return ()=>{
            window.removeEventListener('contextmenu',handleContextMenu);
        }
    },[])
   //想要挂在时候放上去，卸载的时候消失，所以依赖写空数组
   return clickElement;
   //将clickelement返回，这样外界就可因拿到了。
}

export default useContextMenu;