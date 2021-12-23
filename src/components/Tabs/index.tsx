import { Tabs } from 'antd';
import React from 'react';

const { TabPane } = Tabs;

interface Tab {
  key: string;
  tab: string;
  content: any;
  className: string;
}

interface TabsInterface {
  handleChangeTab: any;
  activeKey: string;
  listTab: Tab[];
}

export default function TabsComponnent({ handleChangeTab, activeKey, listTab }: TabsInterface) {
  return (
    <Tabs className="tab-common" onChange={handleChangeTab} activeKey={activeKey}>
      {listTab.map(({ key, tab, content, className }: Tab) => (
        <TabPane key={key} tab={tab} className={className}>
          {content}
        </TabPane>
      ))}
    </Tabs>
  );
}
