import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
    href:string
}
export default class SideNavItem extends React.Component<Props> {

    public render() {
        return (
            <Link to={this.props.href}>
                <div className="p-2 bg-grayBackground text-white cursor-pointer hover:brightness-110 transition-all">{this.props.children}</div>
            </Link>
        );
    }
}