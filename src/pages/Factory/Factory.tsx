import React, { useState } from 'react';
import { TabMenu } from '../../components/TabMenu/TabMenu';
import { FACTORY_TABS } from '../../enum/FACTORY_TABS';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { Issuance } from './Issuance/Issuance';
import { PegIn } from './PegIn/PegIn';
import { PegOut } from './PegOut/PegOut';
import './Factory.scss';

export const Factory = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<FACTORY_TABS>(FACTORY_TABS.ISSUANCE);

  document.title = ROUTE_PATH_TITLE.FACTORY;

  const getFactoryData = () => {
    switch (selectedTab) {
      case FACTORY_TABS.ISSUANCE:
        return <Issuance />;
        break;
      case FACTORY_TABS.PEG_IN:
        return <PegIn />;
        break;
      case FACTORY_TABS.PEG_OUT:
        return <PegOut />;
        break;
      default:
        return;
    }
  };

  return (
    <div className="factory-page-main">
      <div className="factory-page-header">
        <TabMenu
          menuItems={[FACTORY_TABS.ISSUANCE, FACTORY_TABS.PEG_IN, FACTORY_TABS.PEG_OUT]}
          selectedItem={selectedTab}
          onClick={(eventKey: any) => setSelectedTab(eventKey)}
        />
      </div>
      <div className="factory-page-content">{getFactoryData()}</div>
    </div>
  );
};
