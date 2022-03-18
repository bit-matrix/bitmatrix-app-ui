import React, { useState } from 'react';
import { CustomPopover } from '../../../components/CustomPopover/CustomPopover';
import { SELECTED_THEME } from '../../../enum/SELECTED_THEME';
import info from '../../../images/info2.png';
// import exclusiveIcon from '../../../images/mtx.png';
import './Theme.scss';

export const Theme = (): JSX.Element => {
  const [selected, setSelected] = useState<SELECTED_THEME>(SELECTED_THEME.GRAY);

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
            className={`theme-tag gray-theme ${selected === SELECTED_THEME.GRAY && 'theme-selected'}`}
            onClick={() => {
              setSelected(SELECTED_THEME.GRAY);
              document.documentElement.setAttribute('data-theme', SELECTED_THEME.GRAY);
            }}
          />
          <div
            className={`theme-tag white-theme ${selected === SELECTED_THEME.WHITE && 'theme-selected'}`}
            onClick={() => {
              setSelected(SELECTED_THEME.WHITE);
              document.documentElement.setAttribute('data-theme', SELECTED_THEME.WHITE);
            }}
          />
          <div
            className={`theme-tag yellow-theme ${selected === SELECTED_THEME.YELLOW && 'theme-selected'}`}
            onClick={() => {
              setSelected(SELECTED_THEME.YELLOW);
              document.documentElement.setAttribute('data-theme', SELECTED_THEME.YELLOW);
            }}
          />
          <div
            className={`theme-tag red-theme ${selected === SELECTED_THEME.RED && 'theme-selected'}`}
            onClick={() => {
              setSelected(SELECTED_THEME.RED);
              document.documentElement.setAttribute('data-theme', SELECTED_THEME.RED);
            }}
          />
          <div
            className={`theme-tag blue-theme ${selected === SELECTED_THEME.BLUE && 'theme-selected'}`}
            onClick={() => {
              setSelected(SELECTED_THEME.BLUE);
              document.documentElement.setAttribute('data-theme', SELECTED_THEME.BLUE);
            }}
          />
          <div
            className={`theme-tag pink-theme ${selected === SELECTED_THEME.PINK && 'theme-selected'}`}
            onClick={() => {
              setSelected(SELECTED_THEME.PINK);
              document.documentElement.setAttribute('data-theme', SELECTED_THEME.PINK);
            }}
          />
          <div
            className={`theme-tag turquoise-theme ${selected === SELECTED_THEME.TURQUOISE && 'theme-selected'}`}
            onClick={() => {
              setSelected(SELECTED_THEME.TURQUOISE);
              document.documentElement.setAttribute('data-theme', SELECTED_THEME.TURQUOISE);
            }}
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
        <div className="theme-item-content">
          {/* <div
            className={`theme-tag ${selected === SELECTED_THEME.NEON && 'theme-selected'}`}
            onClick={() => setSelected(SELECTED_THEME.NEON)}
          >
            <img className="exclusive-icon" src={exclusiveIcon} alt="" />
          </div> */}
          No exclusive theme found.
        </div>
      </div>
    </div>
  );
};
