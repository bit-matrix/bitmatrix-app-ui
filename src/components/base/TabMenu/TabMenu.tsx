import React from 'react';
import './TabMenu.scss';

type Props = {
  menuItems: Array<string>;
  selectedItem: string;
  onClick: (selectedItem: string) => void;
};

export const TabMenu: React.FC<Props> = ({ menuItems, selectedItem, onClick }) => {
  return (
    <>
      <div className="tab-menu">
        {menuItems.map((menuItem, index) => {
          const menuItemTextClasses = ['tab-menu-item-text'];

          if (menuItem === selectedItem) menuItemTextClasses.push('tab-menu-item-selected');
          return (
            <div
              key={`tab_menu_item_${index}`}
              role="button"
              tabIndex={0}
              className="tab-menu-item"
              onClick={() => {
                onClick(menuItem);
              }}
              // onKeyDown={() => {}}
            >
              <div className={menuItemTextClasses.join(' ')}>
                <h1>{menuItem}</h1>
              </div>
            </div>
          );
        })}
        <div className="tab-menu-line" />
      </div>
    </>
  );
};
