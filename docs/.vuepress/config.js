module.exports = {
  base: '/cancer-advisor/',
  title: 'Cancer Advisor',
  themeConfig: {
    logo: '/images/kgrid-logo.png',
    repo: 'kgrid-demos/cancer-advisor',
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'KGrid.org', link: 'https://kgrid.org' },
      { text: 'Guide', link: '/' },
      // { text: 'Develop', link: '/develop/' },
      { text: 'Cancer Risk Collection', link: 'https://kgrid-objects.github.io/cancer-risk-collection'},
      { text: 'Online Demo', link: 'https://demo.kgrid.org/cancer-advisor/app' }
    ],
    search: true,
    searchMaxSuggestions: 10,
    sidebar: 'auto',
    displayAllHeaders: true
  }
}
