import React from 'react';

import PropTypes from 'prop-types';

import { createStyle } from 'flcss';

import MinimapIndicator from './minimapIndicator.js';

import getTheme from '../colors.js';

const colors = getTheme();

class Minimap extends React.Component
{
  constructor()
  {
    super();

    this.state= {
      x: 0,
      y: 0
    };

    this.onClick = this.onClick.bind(this);
  }

  /**
  * @param { React.MouseEvent } e
  */
  onClick(e)
  {
    /**
    * @type { HTMLElement }
    */
    const mindMapRef = this.props?.mindMapRef?.current;

    if (!mindMapRef)
      return;

    const maxWidth = 260;
    const maxHeight = 157;

    const minWidth = 180;
    const minHeight = 104;

    const miniMapWidth = Math.min(maxWidth, Math.max(window.innerWidth * 0.25, minWidth));
    const miniMapHeight = Math.min(maxHeight, Math.max(window.innerWidth * 0.15, minHeight));

    const mapWidth = miniMapWidth * 10 -  window.innerWidth;
    const mapHeight = miniMapHeight * 10 -  window.innerHeight;

    // the '15' is the element's margin
    let x = e.clientX - 15;
    let y = miniMapHeight - (window.innerHeight - e.clientY - 15);

    // minimal coordinates is 0, 0
    // maximal coordinates is minimap width, height
    x = Math.min(Math.max(x, 0), miniMapWidth);
    y = Math.min(Math.max(y, 0), miniMapHeight);

    // normalize for mindmap size
    x = Math.floor(mapWidth * ((x * 10) / (window.innerWidth + mapWidth)));
    y = Math.floor(mapHeight * ((y * 10) / (window.innerHeight + mapHeight)));

    mindMapRef.parentElement.scrollTo({
      left: x,
      top: y,
      behavior: 'smooth'
    });
  }

  render()
  {
    return <div className={ styles.wrapper } onClick={ this.onClick }>
      <div className={ styles.container }>
        <MinimapIndicator x={ this.state.x } y={ this.state.y }/>
      </div>
    </div>;
  }
}

Minimap.propTypes = {
  mindMapRef: PropTypes.object
};

const styles = createStyle({
  wrapper: {
    position: 'absolute',

    bottom: 0,

    maxWidth: '260px',
    maxHeight: '157px',

    minWidth: '180px',
    minHeight: '104px',

    width: '25vw',
    height: '15vw',

    padding: '15px'
  },

  container: {
    backgroundColor: colors.whiteBackground,

    width: '100%',
    height: '100%'
  }
});

export default Minimap;
