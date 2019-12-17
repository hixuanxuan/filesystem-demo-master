
import React, { forwardRef, useImperativeHandle } from 'react';
import Form, { FormComponentProps } from 'antd/lib/form/Form';

import { Input, Button, Checkbox } from 'antd';


const FormItem = Form.Item;
//form代码，没有什么改进，把下面的提交按钮去掉就行
// class NameForm extends Component {
 
//   render() {
//     const { getFieldDecorator } = this.props.form;
//     return (
//       <Form className="login-form">
//         <Form.Item label={`文件名`}>
//             {getFieldDecorator(`文件名`, {
//               rules: [
//                 {
//                   required: true,
//                   message: '文件名不能为空',
//                 },
//               ],
//             })(<Input placeholder="文件名" />)}
//           </Form.Item>
//       </Form>
//     );
//   }
// }
 


const FCForm = forwardRef(({ form, onSubmit }, ref) => {
  useImperativeHandle(ref, () => ({
    form,
  }));
  // `...the rest of your form`;
  const { getFieldDecorator } = form;
    return   (<Form.Item label={`文件名`}>
            {getFieldDecorator(`fileName`, {
              rules: [
                {
                  required: true,
                  message: '文件名不能为空',
                },
              ],
            })(<Input placeholder="文件名" />)}
          </Form.Item>)
});
const WrappedNameForm = Form.create()(FCForm);



// const WrappedNameForm = Form.create()(NameForm);

export default WrappedNameForm;
