/**
 * Media Browser Tool for the Editor.js
 *
 * @author Illumini <hello@illumini.io>
 * @license MIT
 * @see {@link https://github.com/IlluminiTech/editorjs-media}
 *
 * image: {
 *   class: MediaBrowser,
 *   config: {
 *     onSelectMedia: done => {
 *       const mediaUrl = await openMediaLibrary();
 *       done(mediaUrl);
 *     },
 *   },
 * },
 */

import ButtonIcon from './svg/button-icon.svg';
import ToolboxIcon from './svg/toolbox.svg';

import './index.css';

/**
 * @typedef {object} MediaBrowserConfig
 * @description Config supported by Tool
 * @property {function(done(media)): void [onSelectMedia]} - method that selects external media
 * @property {string} buttonContent - overrides for Browser Media Library button
 */

/**
 * @typedef {object} MediaBrowserData
 * @description Media Browser Tool's input and output data format
 * @property {object} media — Media file data returned from external media library
 * @property {string} media.url — Media URL
 */
export default class MediaBrowser {
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Media',
    };
  }

  /**
   * @param {object} tool - tool properties got from editor.js
   * @param {ImageToolData} tool.data - previously saved data
   * @param {ImageConfig} tool.config - user config for Tool
   * @param {object} tool.api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;
    this.config = config;

    this.onSelectMedia = config.onSelectMedia;

    this._nodes = {
      wrapper: this._createElement('div', [this.CSS.block, this.CSS.wrapper]),
      mediaButton: this._createMediaButton(),
      mediaContainer: this._createElement('div', this.CSS.mediaContainer),
      mediaElement: undefined,
    };

    this._nodes.wrapper.appendChild(this._nodes.mediaContainer);
    this._nodes.wrapper.appendChild(this._nodes.mediaButton);

    this._data = {};
    this.data = data;
  }

  /**
   * CSS classes
   *
   * @returns {object}
   */
  get CSS() {
    return {
      block: this.api.styles.block,
      button: this.api.styles.button,

      wrapper: 'media-browser',
      mediaContainer: 'media-browser__media',
      mediaElement: 'media-browser__media-picture',
    };
  }

  /**
   * Return Tool data
   *
   * @private
   *
   * @returns {MediaBrowserData}
   */
  get data() {
    return this._data;
  }

  /**
   * Stores all Tool's data
   *
   * @private
   *
   * @param {MediaBrowserData} data - data in Media Browser Tool format
   */
  set data(data) {
    this.media = data.media;
  }

  /**
   * Set new media file
   *
   * @private
   *
   * @param {object} file - selected media data
   */
  set media(media) {
    this._data.media = media;

    if (media && media.url) {
      this._fillMedia(media);
    }
  }

  /**
   * Fires after clicks on the Toolbox Media Browser Icon
   * Initiates click on the Browse Media Library button
   *
   * @public
   */
  appendCallback() {
    this._selectMedia();
  }

  /**
   * Renders tool UI
   *
   * @param {MediaBrowserData} toolData - saved tool data
   * @returns {Element}
   */
  render() {
    return this._nodes.wrapper;
  }

  /**
   * Validate Media Browser block data:
   * - check for emptiness
   *
   * @param {MediaBrowserData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(blockData) {
    return !!blockData.media;
  }

  /**
   * Return Block data
   *
   * @public
   *
   * @returns {MediaBrowserData}
   */
  save() {
    return this.data;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS class
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _createElement(tagName, classNames = null, attributes = {}) {
    const element = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      element.classList.add(...classNames);
    } else if (classNames) {
      element.classList.add(classNames);
    }

    for (const attribute in attributes) {
      element[attribute] = attributes[attribute];
    }

    return element;
  }

  /**
   * Creates browse media library button
   *
   * @returns {Element}
   */
  _createMediaButton() {
    const button = this._createElement('div', this.CSS.button);

    button.innerHTML = this.config.buttonContent || `${ButtonIcon} ${this.api.i18n.t('Browse Media Library')}`;

    button.addEventListener('click', () => this._selectMedia());

    return button;
  }

  /**
   * Invokes onSelectMedia function
   */
  _selectMedia() {
    this.onSelectMedia(media => (this.media = media));
  }

  /**
   * Shows media
   *
   * @param {string} url - media source
   */
  _fillMedia({ url }) {
    this._nodes.mediaElement = this._createElement('img', this.CSS.mediaElement, { src: url });

    this._nodes.mediaContainer.appendChild(this._nodes.mediaElement);
    this._nodes.wrapper.removeChild(this._nodes.mediaButton);
  }
}
