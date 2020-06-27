import ButtonIcon from './svg/button-icon.svg';
import ToolboxIcon from './svg/toolbox.svg';

import './index.css';

export default class MediaBrowser {
  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Media',
    };
  }

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

  get CSS() {
    return {
      block: this.api.styles.block,
      button: this.api.styles.button,

      wrapper: 'media-browser',
      mediaContainer: 'media-browser__media',
      mediaElement: 'media-browser__media-picture',
    };
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this.media = data.media;
  }

  set media(media) {
    this._data.media = media;

    if (media && media.url) {
      this._fillMedia(media);
    }
  }

  appendCallback() {
    this._selectMedia();
  }

  render() {
    return this._nodes.wrapper;
  }

  validate(blockData) {
    return !!blockData.media;
  }

  save() {
    return this.data;
  }

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

  _createMediaButton() {
    const button = this._createElement('div', this.CSS.button);

    button.innerHTML = this.config.buttonContent || `${ButtonIcon} ${this.api.i18n.t('Browse Media Library')}`;

    button.addEventListener('click', () => this._selectMedia());

    return button;
  }

  _selectMedia() {
    this.onSelectMedia(media => (this.media = media));
  }

  _fillMedia({ url }) {
    this._nodes.mediaElement = this._createElement('img', this.CSS.mediaElement, { src: url });

    this._nodes.mediaContainer.appendChild(this._nodes.mediaElement);
    this._nodes.wrapper.removeChild(this._nodes.mediaButton);
  }
}
