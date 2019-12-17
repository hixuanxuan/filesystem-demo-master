import React from 'react';
import { Modal, Button ,Form, Input } from 'antd';

import WrappedNameForm from './NameForm'

class CreateModel extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
    let demo=this.refs.getFormVlaue;//通过refs属性可以获得对话框内form对象
    demo.validateFields((err, values) => {
      if(!err){
        console.log(values);//这里可以拿到数据
      }
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        {/* <Button type="primary" onClick={this.showModal}>
          Open Modal
        </Button> */}
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
           <WrappedNameForm ref="getFormVlaue"/>
        </Modal>
      </div>
    );
  }
}

export default CreateModel;

