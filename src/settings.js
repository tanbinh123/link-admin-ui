module.exports = {
  title: 'Vue Link Admin',
  token:'LinkAdmin-Token',
  layout: 'top',
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,
  /**
   * 
   */
  sidebarColor: 'light',
  /**
   * 
   */
  size: 'small',
  /**
   * 
   */
  device: 'desktop',
  /**
   * @type {boolean} true | false
   */
  colorWeak: false,
  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: ['production', 'development']
}
