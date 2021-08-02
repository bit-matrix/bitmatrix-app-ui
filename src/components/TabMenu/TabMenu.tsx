import React from 'react';
import styles from './TabMenu.module.scss';

export interface TabMenuItemProps {
  menuItems: string[];
  selectedItem: string;
  onClick: (selectedItem: string) => void;
}

export const TabMenu: React.FC<TabMenuItemProps> = ({
  menuItems,
  selectedItem,
  onClick,
}) => {
  return (
    <>
      <div className={styles.tabMenu}>
        {menuItems.map((menuItem, index) => {
          const menuItemTextClasses = [styles.tabMenuItemText];

          if (menuItem === selectedItem)
            menuItemTextClasses.push(styles.selected);
          return (
            <div
              key={`tab_menu_item_${index}`}
              role="button"
              tabIndex={0}
              className={styles.tabMenuItem}
              onClick={() => {
                onClick(menuItem);
              }}
              // onKeyDown={() => {}}
            >
              <div className={menuItemTextClasses.join(' ')}>{menuItem}</div>
            </div>
          );
        })}
        <div className={styles.tabMenuLine} />
      </div>
    </>
  );
};
