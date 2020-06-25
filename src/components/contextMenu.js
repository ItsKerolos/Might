import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import { createStyle } from 'flcss';

import getTheme from '../colors.js';

const colors = getTheme();

const click = (e) =>
{
  // by not preventing default, the user can reach
  // the native browser context menu by double clicking
  // the right mouse button
  e.preventDefault();

  // unmount the context menu
  ReactDOM.unmountComponentAtNode(document.querySelector('#contextMenu'));
};

/**
* @param { {
*    x: number,
*    y: number,
*    actions: { title: string, actions: { title: string, callback: () => void }[]], callback: () => void }[]
*  } } param0
*/
const ContextMenu = ({ x, y, actions }) =>
{
  // before passing the x and y
  // they are checked against
  // the width and height of context menu and
  // the width and height of the viewport

  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const menu = {
    // margin so that the menu doesn't snap
    // flat to the viewport edges
    margin: 10,
    // a fixed size
    width: 185,
    // the base height padding of the menu
    height: 30
  };

  // calculate menu height
  actions.forEach((action) =>
  {
    // menu height is the sum of all actions height

    let height = 0;

    if (action.actions)
    {
      // title height
      height = 10;

      // title padding
      height = height + 10;

      // actions height
      height = height + (22 * action.actions.length);

      // actions padding
      height = height + (20 * action.actions.length);
    }
    else
    {
      // action height
      height = 22;

      // action padding
      height = height + 20;
    }

    menu.height = menu.height + height;
  });

  // if the context menu is proven to overflow
  // then it should snap to the corners of the viewport

  if (x + menu.width + menu.margin >= viewport.width)
    x = viewport.width - (menu.width + menu.margin);
  else if (x - menu.margin <= 0)
    x = menu.margin;

  if (y + menu.height + menu.margin >= viewport.height)
    y = viewport.height - (menu.height + menu.margin);
  else if (y - menu.margin <= 0)
    y = menu.margin;

  return <div className={ styles.wrapper } onClick={ click } onContextMenu={ click }>
    <div style={ { left: x, top: y } } className={ styles.container }>
      {
        actions.map((action, i) =>
        {
          if (action.actions)
          {
            return <div key={ i }>
              <div className={ styles.title }>{ action.title }</div>

              <div className={ styles.submenu }>
                {
                  action.actions.map((action, i) =>
                  {
                    return <div key={ i } className={ styles.action } onClick={ action.callback }>
                      { action.title }
                    </div>;
                  })
                }
              </div>
            </div>;
          }
          else
          {
            return <div key={ i } className={ styles.action } onClick={ action.callback }>
              { action.title }
            </div>;
          }
        })
      }
    </div>
  </div>;
};

ContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object).isRequired
};

const styles = createStyle({
  wrapper: {
    zIndex: 2,
    position: 'absolute',

    overflow: 'hidden',

    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh'
  },

  container: {
    position: 'relative',
    backgroundColor: colors.whiteBackground,

    fontFamily: 'Noto Sans',
    fontWeight: 700,

    width: '185px',
    
    boxShadow: `${colors.blackShadow} 0px 0px 9px 3px`,
    padding: '15px 0'
  },

  title: {
    userSelect: 'none',

    textTransform: 'uppercase',

    color: colors.accent,
    backgroundColor: colors.whiteBackground,

    height: '10px',

    fontSize: '8px',
    padding: '5px 10px'
  },

  submenu: {
    display: 'flex',
    flexWrap: 'wrap',

    '> div': {
      flexBasis: '100%'
    }
  },

  action: {
    display: 'flex',
    alignItems: 'center',

    cursor: 'pointer',

    color: colors.blackText,
    backgroundColor: colors.whiteBackground,

    height: '22px',

    fontSize: '12px',
    padding: '10px',

    ':hover': {
      color: colors.whiteText,
      backgroundColor: colors.accent
    }
  }
});

export default ContextMenu;