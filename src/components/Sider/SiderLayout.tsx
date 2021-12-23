import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Layout, Button, Menu } from 'antd';

import Logo from 'resources/images/logo.png';
import IconMenu from 'resources/svg/IconMenu';

import { privateRoutes } from 'Routes';

const { Item } = Menu;
const { SubMenu } = Menu;
const { Sider } = Layout;

export function SiderLayout({ selectedKey, goToPage }: { selectedKey: any; goToPage: any }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed((collapsed) => !collapsed);
  };

  return (
    <Sider className="sider" width={300} theme={'dark'}>
      <div className="sider__top">
        <Link
          to={privateRoutes[1].path}
          className={classnames({
            hide: collapsed,
          })}
        >
          <img src={Logo} alt="plannet logo" className={'sider__top--logo'} />
        </Link>
        <Button className="sider__top--collapse" onClick={toggleCollapse} icon={<IconMenu />} />
      </div>
      <Menu className="sider__menu" theme="dark" selectedKeys={[selectedKey]} mode="inline" inlineCollapsed={collapsed}>
        {privateRoutes.map((item: any, index: number) => (
          <Fragment key={index}>
            {!!item.inMenu && (
              <Item className="sider__menu--item" key={item.path} icon={item.icon} onClick={goToPage}>
                {item.name}
              </Item>
            )}
            {item?.subMenu && (
              <SubMenu key={index} icon={item.icon} title={item.name}>
                {item.subMenu.map((subItem: any) => (
                  <Item key={subItem.path} onClick={goToPage}>
                    {subItem.name}
                  </Item>
                ))}
              </SubMenu>
            )}
          </Fragment>
        ))}
      </Menu>
    </Sider>
  );
}
