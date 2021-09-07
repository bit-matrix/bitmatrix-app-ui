import React, { useState } from 'react';
import { TabMenu } from '../../components/TabMenu/TabMenu';
import { General } from './General/General';
import { Privacy } from './Privacy/Privacy';
import './Settings.scss';

enum SettingsDetailTabs {
  GENERAL = 'General',
  PRIVACY = 'Privacy',
  THEME = 'Theme',
  ADVANCED = 'Advanced',
}

export const Settings = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<SettingsDetailTabs>(
    SettingsDetailTabs.GENERAL,
  );

  const getSettingsData = () => {
    switch (selectedTab) {
      case SettingsDetailTabs.GENERAL:
        return <General />;
        break;
      case SettingsDetailTabs.PRIVACY:
        return <Privacy />;
        break;
      case SettingsDetailTabs.THEME:
        return <div></div>;
        break;
      case SettingsDetailTabs.ADVANCED:
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
            SettingsDetailTabs.GENERAL,
            SettingsDetailTabs.PRIVACY,
            SettingsDetailTabs.THEME,
            SettingsDetailTabs.ADVANCED,
          ]}
          selectedItem={selectedTab}
          onClick={(eventKey: any) => setSelectedTab(eventKey)}
        />
      </div>
      <div className="settings-page-content">{getSettingsData()}</div>
    </div>
  );
};
