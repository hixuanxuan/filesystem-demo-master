import React from 'react'
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import {Link} from 'react-router-dom'
import store from '../util/store'
import './login.css'
import nedb from '../util/nedb'
class NormalLoginForm extends React.Component {
  constructor(props){
    super(props);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        nedb.find({username:values.username},(err,docs)=>{
          console.log(docs);
          if(docs.length===0){
            //说明是新用户
            nedb.insert(values,(err, newDocs)=>{
              message.success('创建成功')
            })
          }else{
           //console.log(docs);
           if(docs[0].password===values.password){
             message.success('登陆成功')
             //登陆后记住当前的用户用户名
            //判断当前用户下面是否有存储数据，没有则按照默认数据处理
            if(!store.get(`${values.username}`)){
              store.set({
                [values.username]:[
                    {
                      title:'parent0',
                      key:'0-0',
                      isLeaf:false,
                      // children:[]
                  },
                  {
                    title:'parent1',
                    key:'0-1',
                    isLeaf:false,
                    // children:[]
                  },
                  {
                    title:'parent2',
                    key:'0-2',
                    isLeaf:false,
                    // children:[]
                  }
                ]
               });
            }
             //执行跳转
             //this.props.handleHistoryPush();
            // console.log(this.props.history);
             this.props.history.push({pathname:"/",  query: {
                    username:values.username
              }});
           }else{
             message.error("密码错误")
           }
          }
        })
      }
    });
    //登陆，先判断该用户是否存在，不存在创建这个？？
    //去数据库校验密码是否正确，如果正确就登陆成功，不正确登陆失败
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <Link to="/register">register now!</Link>
        </Form.Item>
      </Form>
    );
  }
}

const LoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

export default LoginForm;