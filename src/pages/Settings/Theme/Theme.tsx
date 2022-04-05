import React from 'react';
import { CustomPopover } from '../../../components/CustomPopover/CustomPopover';
import { SELECTED_THEME } from '../../../enum/SELECTED_THEME';
import { useSettingsContext } from '../../../context';
import info from '../../../images/info2.png';
import BananaIcon from '../../../images/banana.png';
//import exclusiveIcon from '../../../images/mtx.png';
import './Theme.scss';

export const Theme = (): JSX.Element => {
  const { settingsContext, setThemeContext } = useSettingsContext();

  const themeOnClick = (selectedTheme: SELECTED_THEME) => {
    setThemeContext({ selectedTheme, exclusiveThemes: [...settingsContext.theme.exclusiveThemes] });
  };

  const exclusiveThemes = () => {
    if (settingsContext.theme.exclusiveThemes.length > 0) {
      return settingsContext.theme.exclusiveThemes.map((exc, i) => {
        if (exc === SELECTED_THEME.BANANA) {
          return (
            <div
              key={i}
              className={`theme-tag ${
                settingsContext.theme.selectedTheme === SELECTED_THEME.BANANA && 'theme-selected'
              }`}
              onClick={() => themeOnClick(SELECTED_THEME.BANANA)}
            >
              <img src={BananaIcon} className="banana-icon-theme" />
            </div>
          );
        }
      });
    } else {
      return <span>No exclusive theme found.</span>;
    }
  };

  const themeIsSelected = (selectedTheme: SELECTED_THEME) => {
    if (settingsContext.theme.selectedTheme === selectedTheme) {
      return 'theme-selected';
    }
    return '';
  };

  return (
    <div className="theme-main">
      <div className="theme-item">
        <div className="theme-item-head">
          <span className="theme-title">Standard Themes</span>
          <CustomPopover
            placement="autoHorizontal"
            title="Standard Themes"
            content="Choose one of the default themes to change your interface appearance."
          >
            <img className="general-icon" src={info} alt="info" />
          </CustomPopover>
        </div>
        <div className="theme-item-content">
          <div
            className={`theme-tag neon-theme ${themeIsSelected(SELECTED_THEME.NEON)}`}
            onClick={() => themeOnClick(SELECTED_THEME.NEON)}
          />
          <div
            className={`theme-tag white-theme ${themeIsSelected(SELECTED_THEME.WHITE)}`}
            onClick={() => themeOnClick(SELECTED_THEME.WHITE)}
          />
          <div
            className={`theme-tag orange-theme ${themeIsSelected(SELECTED_THEME.ORANGE)}`}
            onClick={() => themeOnClick(SELECTED_THEME.ORANGE)}
          />
          <div
            className={`theme-tag red-theme ${themeIsSelected(SELECTED_THEME.RED)}`}
            onClick={() => themeOnClick(SELECTED_THEME.RED)}
          />
          <div
            className={`theme-tag blue-theme ${themeIsSelected(SELECTED_THEME.BLUE)}`}
            onClick={() => themeOnClick(SELECTED_THEME.BLUE)}
          />
          <div
            className={`theme-tag pink-theme ${themeIsSelected(SELECTED_THEME.PINK)}`}
            onClick={() => themeOnClick(SELECTED_THEME.PINK)}
          />
          <div
            className={`theme-tag turquoise-theme ${themeIsSelected(SELECTED_THEME.TURQUOISE)}`}
            onClick={() => themeOnClick(SELECTED_THEME.TURQUOISE)}
          />
        </div>
      </div>
      <div className="theme-item">
        <div className="theme-item-head">
          <span className="theme-title">Exclusive Themes</span>
          <CustomPopover
            placement="autoHorizontal"
            title="Exclusive Themes"
            content="Your exclusive themes will appear here if you happen to own theme NFTs in your wallet."
          >
            <img className="general-icon" src={info} alt="info" />
          </CustomPopover>
        </div>
        <div className="theme-item-content">{exclusiveThemes()}</div>
      </div>
    </div>
  );
};
