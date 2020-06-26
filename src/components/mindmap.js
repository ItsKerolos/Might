/* eslint-disable security/detect-object-injection */

import React from 'react';
import ReactDOM from 'react-dom';

import { createStyle } from 'flcss';

// import { saveAs } from 'file-saver';

import getTheme from '../colors.js';

import TopBar from './topBar.js';
import Minimap from './minimap.js';

import ContextMenu from './contextMenu.js';

import Item from './item.js';

import Horizontal from './horizontal.js';
import Vertical from './vertical.js';

import Dialogue from './dialogue.js';

const colors = getTheme();

const mindMapRef = React.createRef();

/**
* @typedef { Object } FamilizedItem
* @property { { testIndex: number, stepIndex: number }[] } occurrences
* @property { string } title
* @property { string } action
* @property { string } value
* @property { FamilizedObject } children
*/

/**
* @typedef { Object<string, FamilizedItem> } FamilizedObject
*/

class Mindmap extends React.Component
{
  constructor()
  {
    super();

    this.state = {
      /**
      * @type { { title: string, steps: { action: string, value: string }[] }[] }
      */
      data: undefined,

      /**
      * @type { FamilizedObject }
      */
      familizedData: undefined
    };

    this.onFileSave = this.onFileSave.bind(this);
    this.onFileLoad = this.onFileLoad.bind(this);

    this.onContextMenu = this.onContextMenu.bind(this);

    this.addStepAfter = this.addStepAfter.bind(this);
    this.addNewStep = this.addNewStep.bind(this);

    this.deleteStep = this.deleteStep.bind(this);
    this.editStep = this.editStep.bind(this);
  }

  componentDidMount()
  {
    const maxWidth = 260;
    const maxHeight = 157;

    const minWidth = 180;
    const minHeight = 104;

    const miniMapWidth = Math.min(maxWidth, Math.max(window.innerWidth * 0.25, minWidth));
    const miniMapHeight = Math.min(maxHeight, Math.max(window.innerWidth * 0.15, minHeight));

    const mapWidth = miniMapWidth * 10 -  window.innerWidth;
    const mapHeight = miniMapHeight * 10 -  window.innerHeight;

    // scroll to center of the map on start
    mindMapRef.current.parentElement.scrollTo({
      left: mapWidth / 2,
      top: mapHeight / 2,
      behavior: 'auto'
    });

    // REMOVE (test group)
    this.loadMap(JSON.parse('{"data":[{"title":"test search-bar input 1","steps":[{"action":"wait","value":2},{"action":"type","value":"Hello World"}]}]}').data);

    // REMOVE (test group 2)
    // this.loadMap(JSON.parse('{"data":[{"title":"test search-bar input 1","steps":[{"action":"wait","value":2},{"action":"type","value":"Hello World"}]}, {"title":"test search-bar input 1","steps":[{"action":"wait","value":2},{"action":"type","value":"Hello Mars"}]}]}').data);

    // REMOVE (test group 3)
    // this.loadMap(JSON.parse('{"data":[{"title":"test search-bar input 1","steps":[{"action":"wait","value":2},{"action":"type","value":"Hello World"}]},{"title":"test search-bar input 1","steps":[{"action":"wait","value":2},{"action":"type","value":"Hello World"},{"action":"click"}]}]}').data);

    // REMOVE (one group)
    // this.loadMap(JSON.parse('{"data":[{"title":"test search-bar input 1","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"type","value":"Hello World"}]},{"title":"test search-bar input 4","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"type","value":"Hello Mars"}]},{"title":"test search-bar input 5","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"click"}]}]}').data);

    // REMOVE (one group 2)
    // this.loadMap(JSON.parse('{"data":[{"title":"test search-bar input 1","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"type","value":"Hello World"}]},{"title":"test search-bar input 4","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"type","value":"Hello Mars"}]},{"title":"test search-bar input 4.5","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"type","value":"Hello Mars"},{"action":"click"}]},{"title":"test search-bar input 5","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"click"}]}]}').data);

    // REMOVE (three group)
    // this.loadMap(JSON.parse('{"data":[{"title":"test search-bar input 1","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"type","value":"Hello World"}]},{"title":"test search-bar input 1","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"type","value":"Hello World"},{"action":"click"}]},{"title":"test search-bar input 2","steps":[{"action":"select","value":"input.js-search-input"},{"action":"type","value":"Hello World"}]},{"title":"test search-bar input 3","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-button"},{"action":"click"}]},{"title":"test search-bar input 4","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"type","value":"Hello Mars"}]},{"title":"test search-bar input 5","steps":[{"action":"wait","value":2},{"action":"select","value":"input.js-search-input"},{"action":"click"}]}]}').data);
  }

  /**
  * @param { React.SyntheticEvent } e
  */
  onFileSave()
  {
    // TODO
    // const blob = new Blob([ '{ "a": "b" }' ], { type: 'application/json;charset=utf-8' });

    // saveAs(blob, 'might.gui.json');
  }

  /**
  * @param { React.SyntheticEvent } e
  */
  onFileLoad(e)
  {
    /**
    * @type { File }
    */
    function readJSON(file)
    {
      return new Promise((resolve, reject) =>
      {
        const fr = new FileReader();

        fr.onerror = () => reject(fr.error);
        fr.onload = () => resolve(JSON.parse(fr.result));

        fr.readAsText(file, 'utf8');
      });
    }

    /**
    * @type { FileList }
    */
    const files = e.target.files;

    readJSON(files[0]).then((file) => this.loadMap(file.data));
  }

  serializeStep(step)
  {
    if (step.action === 'wait')
      return `Wait ${step.value}s`;
    else if (step.action === 'select')
      return `Select ${step.value}`;
    else if (step.action === 'click')
      return 'Click';
    else if (step.action === 'type')
      return `Type ${step.value}`;
  }

  /**
  * @param { { title: string, steps: { action: string, value: string }[] }[] } data
  */
  loadMap(data)
  {
    /**
    * @type { FamilizedObject }
    */
    const familizedData = {};

    // for each test in map
    data.forEach((test, testIndex) =>
    {
      /**
      * @type { FamilizedObject }
      */
      let parent;

      // for step in test
      test.steps.forEach((step, stepIndex) =>
      {
        const key = this.serializeStep(step);

        // if this step is the last in a full test
        // it should be have the test's title to mark the path of the test

        // title should not be an issue
        // on duplicated steps

        // TODO handle identical tests (duplicates)
        // there never should be a step that needs two different titles
        // that would mean that there are 2 completely identical tests
        // and we can filter them out and only leave the first one

        // title are given to items that are the last in their branches only
        // (for UI reasons)
        // this is easier than doing a check on rendering
        const title = (stepIndex === test.steps.length - 1) ? test.title : undefined;

        // if the step is the first in the test
        if (stepIndex === 0)
        {
          // we use the serialized step string as an identifier
          // to catch duplicated steps

          // if step is not a duplicate
          // create a new entry for it

          // however if a step is a duplicate
          // we should push new occurrence to the array

          if (familizedData[key] === undefined)
          {
            familizedData[key] = {
              title,
              occurrences: [ { testIndex, stepIndex } ],
              ...step
            };
          }
          else
          {
            familizedData[key].occurrences.push({ testIndex, stepIndex });
          }

          // set this step as the new parent
          // going forward in a path until the last step in the test
          parent = familizedData[key];
        }
        else
        {
          if (!parent.children)
            parent.children = {};

          const obj = parent.children;

          if (obj[key] === undefined)
          {
            obj[key] = {
              title,
              occurrences: [ { testIndex, stepIndex } ],
              ...step
            };
          }
          else
          {
            obj[key].occurrences.push({ testIndex, stepIndex });
          }

          parent = obj[key];
        }
      });
    });

    this.setState({
      data,
      familizedData
    });
  }

  /**
  * @param { React.SyntheticEvent } e
  */
  onContextMenu(e)
  {
    // prevent the native browser context menu from showing
    e.preventDefault();

    // mount the context menu
    ReactDOM.render(<ContextMenu
      x={ e.nativeEvent.pageX }
      y={ e.nativeEvent.pageY }
      actions={ [ { title: 'Add New Step', callback: this.addNewStep } ] }
    />, document.querySelector('#contextMenu'));
  }

  /**
  * @param { { testIndex: number, stepIndex: number }[] } occurrences
  * @param { 'new' | 'insert' } mode
  */
  addStepAfter(occurrences, mode)
  {
    const data = this.state.data;

    const step = { action: 'type', value: 'New Step' };
    
    // emits when the step edit dialogue is done
    const done = (action, value) =>
    {
      if (action !== undefined)
        step.action = action;

      if (value !== undefined)
        step.value = value;
        
      if (mode === 'new')
      {
        // FIX handle it
        // to recreate error click add on any item that has more than 1 child
        if (occurrences.length > 1)
          throw new Error('unhandled duplication issue');

        // copy test
        const test = { ...data[occurrences[0].testIndex] };

        // set a new empty title for the test
        test.title = 'New Untitled Test';

        // slice the steps to removed unneeded steps
        test.steps = test.steps.slice(0, occurrences[0].stepIndex + 1);

        // push new step
        test.steps.push(step);

        // push new test
        data.push(test);
      }
      else
      {
        // insert in every occurrence
        occurrences.forEach((occurrence) =>
        {
          // get test
          const test = data[occurrence.testIndex];

          // split the steps from current stepIndex
          const steps1 = test.steps.slice(0, occurrence.stepIndex + 1);
          const steps2 = test.steps.slice(occurrence.stepIndex + 1);

          // push new step in between

          steps1.push(step);

          test.steps = steps1.concat(steps2);
        });
      }

      // re-create the mindmap with the new data
      this.loadMap(data);
    };

    // open dialog to edit the new step
    ReactDOM.render(<Dialogue type={ 'edit-step' } step={ step } done={ done }/>, document.querySelector('#dialogue'));
  }

  addNewStep()
  {
    const data = this.state.data;

    const step = { action: 'type', value: 'New Step' };

    // emits when the step edit dialogue is done
    const done = (action, value) =>
    {
      if (action !== undefined)
        step.action = action;

      if (value !== undefined)
        step.value = value;

      const test = {
        title: 'New Untitled Test',
        steps: [
          step
        ]
      };

      // push new test
      data.push(test);

      // re-create the mindmap with the new data
      this.loadMap(data);
    };

    ReactDOM.render(<Dialogue type={ 'edit-step' } step={ step } done={ done }/>, document.querySelector('#dialogue'));
  }

  /**
  * @param { { testIndex: number, stepIndex: number }[] } occurrences
  */
  editStep(occurrences)
  {
    // TODO there should be a visual feedback that the changes were applied

    const data = this.state.data;

    const done = (action, value) =>
    {
      // edit each occurrence of the required step
      occurrences.forEach((occurrence) =>
      {
        const step = data[occurrence.testIndex].steps[occurrence.stepIndex];

        if (action !== undefined)
          step.action = action;

        if (value !== undefined)
          step.value = value;
      });

      // re-create the mindmap with the new data
      this.loadMap(data);
    };

    const occurrence = occurrences[0];

    const step = data[occurrence.testIndex].steps[occurrence.stepIndex];

    ReactDOM.render(<Dialogue type={ 'edit-step' } step={ step } done={ done }/>, document.querySelector('#dialogue'));
  }

  /**
  * @param { number } testIndex
  */
  editTitle(testIndex)
  {
    const data = this.state.data;

    const done = (action, value) =>
    {
      // validate title
      if (typeof value === 'string' && value.length > 0)
        data[testIndex].title = value;

      // re-create the mindmap with the new data
      this.loadMap(data);
    };
    
    // open a dialogue that edits just the title
    ReactDOM.render(<Dialogue type={ 'edit-title' } title={ data[testIndex].title } done={ done }/>, document.querySelector('#dialogue'));
  }

  /**
  * @param { { testIndex: number, stepIndex: number }[] } occurrences
  * @param { 'this' | 'branch' } mode
  */
  deleteStep(occurrences, mode)
  {
    const data = this.state.data;

    const done = () =>
    {
      // removes each occurrence of the required step
      occurrences.forEach((occurrence) =>
      {
        /**
        * @type { Array }
        */
        const steps = data[occurrence.testIndex].steps;

        // there's two ways to delete items
        
        // delete the item and any other items branched from it
        if (mode === 'branch')
        {
          // delete the step and all of its children
          steps.splice(occurrence.stepIndex);
        }
        // delete just the item and leave its children in place
        else
        {
          // delete just the step it self
          // leaving its children as is
          steps.splice(occurrence.stepIndex, 1);
        }
      });

      // re-create the mindmap with the new data
      this.loadMap(data);
    };

    ReactDOM.render(<Dialogue type={ 'delete-step' } done={ done }/>, document.querySelector('#dialogue'));
  }
 
  render()
  {
    /**
    * @param { string[] } children
    * @param { number } index
    * @param { FamilizedItem } item
    * @param { 'mini' | 'full' } mode
    */
    const handlePreLines = (children, index, item, mode) =>
    {
      // if parent had no children
      // or if only has one child (then the parent will connect
      // with that child using a post-line only)
      if (!children)
        return <div/>;

      // first child lines are reversed in direction
      return <div className={ (index === 0) ? styles.lines : styles.lines }>

        {
          // if there's only one child then not show any vertical lines
          (children.length > 1) ?
            // first line should be rotated upside down (reversed)
            // first and last child get half vertical lines
            // all other children get full vertical lines
            <Vertical reverse={ index === 0 } half={ index === 0 || index === children.length - 1 } mode={ mode }/> :
            <div/>
        }

        <Horizontal mode={ mode } title={ item.title } onClick={ () => this.editTitle(item.occurrences[0].testIndex) }/>

      </div>;
    };

    /**
    * @param { string[] } children
    * @param { 'mini' | 'full' } mode
    */
    const handlePostLines = (children, mode) =>
    {
      // post lines are only drawn to connect to the pre-lines of the next step in the map
      // that means that there need to be pre-lines
      if (!children || children.length <= 1)
        return <div/>;

      return <Horizontal mode={ mode }/>;
    };

    // using the familized data
    // we render the steps in order
    // with parent and children (nesting)

    // this always for better UX since no repeated steps are rendered
    // and the user can add new tests where-ever they need them without needing
    // to copy steps from previous tests

    /**
    * @param { FamilizedObject } children
    * @param { 'mini' | 'full' } mode
    * @param { boolean } continuation
    */
    const handleItems = (children, mode, continuation) =>
    {
      // nothing to be rendered
      if (!children)
        return <div/>;

      const keys = Object.keys(children);

      return <div className={ styles.column }>
        {
          keys.map((step, index) =>
          {
            const item = children[step];

            return <div key={ index } className={ styles.row }>

              {/* no continuation means that the item is the first in the branch and
                  does not need any pre-lines
              */}
              { (continuation) ? handlePreLines(keys, index, item, mode) : undefined }

              <Item mindmap={ this } mode={ mode } title={ step } occurrences={ item.occurrences }/>

              { handlePostLines(Object.keys(item.children || {}), mode) }

              { handleItems(item.children, mode, true) }
            </div>;
          })
        }
      </div>;
    };

    return <div ref={ mindMapRef } className={ styles.wrapper }>

      <TopBar onFileSave={ this.onFileSave } onFileLoad={ this.onFileLoad }/>

      {/* Mini-map */}
      <Minimap mindMapRef={ mindMapRef } onContextMenu={ this.onContextMenu }>
        { handleItems(this.state.familizedData, 'mini', false) }
      </Minimap>

      {/* Full-map */}
      <div className={ styles.container } onContextMenu={ this.onContextMenu }>
        { handleItems(this.state.familizedData, 'full', false) }
      </div>

    </div>;
  }
}

const styles = createStyle({
  wrapper: {
    backgroundColor: colors.whiteBackground,

    maxWidth: 'calc(260px * 10)',
    maxHeight: 'calc(157px * 10)',

    minWidth: 'calc(180px * 10)',
    minHeight: 'calc(104px * 10)',

    width: 'calc(25vw * 10)',
    height: 'calc(15vw * 10)'
  },

  container: {
    display: 'flex',

    justifyContent: 'center',
    alignItems: 'center',

    fontFamily: 'Noto Sans',
    fontWeight: 700,

    width: '100%',
    height: '100%'
  },

  row: {
    display: 'flex',
    flexDirection: 'row'
  },

  column: {
    display: 'flex',
    flexDirection: 'column',

    alignItems: 'flex-start'
  },

  lines: {
    display: 'flex'
  }
});

export default Mindmap;
