import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { Layout, Badge, Dropdown, Button, Avatar, Menu } from 'antd';
import { useWeb3React } from '@web3-react/core';

import IconBell from 'resources/svg/IconBell';
import IconLogout from 'resources/svg/IconLogout';

import { convertAddress } from 'utils';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import selectedAddress from 'redux/address/selector';
import { handleSetIsAdminAction } from 'redux/auth/slice';
import { handleSetAddressNetwork } from 'redux/address/slice';

const { Header } = Layout;
const { Item } = Menu;

const HeaderCommon = (element) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { active, deactivate } = useWeb3React();
  const { address } = useAppSelector(selectedAddress.getAddress);

  const handleDisconnect = () => {
    dispatch(handleSetAddressNetwork({}));
    dispatch(handleSetIsAdminAction({ isAdmin: false }));
    if (active) {
      deactivate();
    }
  };

  const UserDropdown = () => {
    return (
      <div className='header-dropdown'>
        <div className='header-dropdown__detail'>
          <Avatar
            src={'https://gmlubricant.com/wp-content/uploads/2016/02/ava-5.png'}
            alt={'avatar'}
          />
          <div className='header-dropdown__detail--address'>
            {convertAddress(address)}
          </div>
        </div>
        <Menu>
          <Item key='3' icon={<IconLogout />} onClick={handleDisconnect}>
            {t('header.txt_disconnect')}
          </Item>
        </Menu>
      </div>
    );
  };

  return (
    <Header className='header'>
      <div className='header__right'>
        {/* <Select
          defaultValue={currentLanguage}
          style={{ width: 114 }}
          onChange={handleChangeLanguage}
          suffixIcon={<IconArrowDown />}
          dropdownClassName="select-dropdown-language"
        >
          {languages(t).map((language) => (
            <Option value={language.key} key={language.key}>
              {language.value}
            </Option>
          ))}
        </Select> */}
        {/* <Dropdown overlay={ListNotification(t)} trigger={["click"]} className="notification-dropdown"> */}
        <Badge className='header__right--noti-icon' overflowCount={99}>
          <IconBell />
        </Badge>
        {/* </Dropdown> */}
        <Dropdown
          overlay={UserDropdown()}
          trigger={['click']}
          className='header__right--profile'
        >
          <Button>
            <Avatar
              src={
                'https://gmlubricant.com/wp-content/uploads/2016/02/ava-5.png'
              }
              alt={'avatar'}
            />
            <div className='username' title={address}>
              {convertAddress(address)}
            </div>
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
};
export default withTranslation()(HeaderCommon);
