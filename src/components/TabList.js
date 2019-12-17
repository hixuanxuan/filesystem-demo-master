import React from 'react';

class TabList extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        const { title } = this.props;
        return (
            <>
            <ul className="tablist-wrapper">
                <li className="tablist-content">
                    <span>{title}</span>
                </li>
            </ul>
            </>
        )
    }
}

export default TabList;