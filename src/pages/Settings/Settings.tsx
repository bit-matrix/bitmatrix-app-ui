import React, { useState } from 'react';
import { TabMenu } from '../../components/TabMenu/TabMenu';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { SETTINGS_DETAIL_TABS } from '../../enum/SETTINGS_DETAIL_TABS';
import { General } from './General/General';
import { Privacy } from './Privacy/Privacy';
import './Settings.scss';
import { Theme } from './Theme/Theme';

export const Settings = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<SETTINGS_DETAIL_TABS>(SETTINGS_DETAIL_TABS.GENERAL);

  document.title = ROUTE_PATH_TITLE.SETTINGS;

  const getSettingsData = () => {
    switch (selectedTab) {
      case SETTINGS_DETAIL_TABS.GENERAL:
        return <General />;
        break;
      case SETTINGS_DETAIL_TABS.PRIVACY:
        return <Privacy />;
        break;
      case SETTINGS_DETAIL_TABS.THEME:
        return <Theme />;
        break;
      case SETTINGS_DETAIL_TABS.ADVANCED:
        return <div></div>;
        break;
      default:
        return;
    }
  };

  return (
    <div className="settings-page-main">
      <div className="settings-page-header">
        <TabMenu
          menuItems={[
            SETTINGS_DETAIL_TABS.GENERAL,
            SETTINGS_DETAIL_TABS.PRIVACY,
            SETTINGS_DETAIL_TABS.THEME,
            SETTINGS_DETAIL_TABS.ADVANCED,
          ]}
          selectedItem={selectedTab}
          onClick={(eventKey: any) => setSelectedTab(eventKey)}
        />
      </div>
      <div className="settings-page-content">{getSettingsData()}</div>
    </div>
  );
};
