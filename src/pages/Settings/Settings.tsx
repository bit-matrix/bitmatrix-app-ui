import { useState } from 'react';
import { TabMenu } from '../../components/base/TabMenu/TabMenu';
import { ROUTE_PATH_TITLE } from '../../enum/ROUTE_PATH.TITLE';
import { SETTINGS_DETAIL_TABS } from '../../enum/SETTINGS_DETAIL_TABS';
import { Advanced } from './Advanced/Advanced';
import { General } from './General/General';
import { Privacy } from './Privacy/Privacy';
import { Theme } from './Theme/Theme';
import { Helmet } from 'react-helmet';
import './Settings.scss';

export const Settings = (): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<SETTINGS_DETAIL_TABS>(SETTINGS_DETAIL_TABS.GENERAL);

  //document.title = ROUTE_PATH_TITLE.SETTINGS;

  const getSettingsData = () => {
    switch (selectedTab) {
      case SETTINGS_DETAIL_TABS.GENERAL:
        return <General />;
      case SETTINGS_DETAIL_TABS.PRIVACY:
        return <Privacy />;
      case SETTINGS_DETAIL_TABS.THEME:
        return <Theme />;
      case SETTINGS_DETAIL_TABS.ADVANCED:
        return <Advanced />;
      default:
        return;
    }
  };

  const settingsTabClasses = [];
  if (selectedTab === SETTINGS_DETAIL_TABS.ADVANCED) {
    settingsTabClasses.push('advanced');
  }
  if (selectedTab === SETTINGS_DETAIL_TABS.GENERAL) {
    settingsTabClasses.push('general');
  }
  if (selectedTab === SETTINGS_DETAIL_TABS.PRIVACY) {
    settingsTabClasses.push('privacy');
  }
  if (selectedTab === SETTINGS_DETAIL_TABS.THEME) {
    settingsTabClasses.push('theme');
  }

  return (
    <div>
      <Helmet>
        <title>{ROUTE_PATH_TITLE.SETTINGS}</title>
        <meta name="description" content="Set your slippage tolerance and customize Bitmatrix appearance."></meta>
        <meta
          name="keywords"
          content="Bitmatrix, Liquid Bitcoin, Liquid Network, Slippage Tolerance, Preffered Unit, Theme, Explorer, Network, Wallet Connection"
        ></meta>
        <link type="text/css" href="./Settings.scss" />
      </Helmet>
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
        <div className="settings-page-content">
          <div className={settingsTabClasses.join(' ')}>{getSettingsData()}</div>
        </div>
      </div>
    </div>
  );
};
