<script>
import RssParser from 'rss-parser';
import xmlStrToJsonObj from 'src/utils/xml2Json';

// function getCurrentTabId(callback) {
//   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//     if (callback) callback(tabs.length ? tabs[0].id : null);
//   });
// }

// chrome.contextMenus.removeAll();
// chrome.contextMenus.create({
//   title: '批量获取评论',
//   onclick() {
//     getCurrentTabId(tabId => {
//       chrome.tabs.connect(tabId, {
//         name: 'test-connect'
//       });
//     });
//   }
// });

const rssArticles = [];

export default {
  name: 'Index',
  data() {
    return {
      rssOriginList: [],
      articleList: [],
      content: '',
      title: '',

      fileUrl: '',
      fileName: ''
    };
  },

  mounted() {
    chrome.storage.sync.get({ rssOriginList: [] }, res => {
      this.rssOriginList = res.rssOriginList;

      this.initOutputOpml();

      if (res.rssOriginList.length) {
        const parser = new RssParser();
        res.rssOriginList.forEach((item, index) => {
          parser.parseURL(item.xmlUrl, (err, feed) => {
            if (err) throw err;

            rssArticles[index] = feed.items;
          });
        });
      }
    });
  },

  methods: {
    bindInput(e) {
      const file = e.srcElement.files[0];
      const reader = new FileReader();
      const self = this;

      reader.onload = function() {
        const jsonObj = xmlStrToJsonObj(this.result);

        self.rssOriginList = [];

        jsonObj.opml.body.outline.forEach(item => {
          const newItem = item['@attributes'];
          newItem.icon = `${newItem.htmlUrl}favicon.ico`;
          self.rssOriginList.push(newItem);
        });

        chrome.storage.sync.set({ rssOriginList: self.rssOriginList });

        self.initOutputOpml();
      };
      reader.readAsText(file);
    },

    bindRssClick(i) {
      this.articleList = rssArticles[i];
    },

    bindArticleClick(item) {
      this.title = item.title;
      this.content = item.content;
    },

    initOutputOpml() {
      const content = `
        <?xml version="1.0" encoding="UTF-8"?>
        <!-- OPML generated by NetNewsWire -->
        <opml version="1.1">
          <head>
            <title>Subscriptions-OnMyMac.opml</title>
          </head>
          <body>
            ${this.rssOriginList.map(this.getOpmlItem).join('')}
          </body>
        </opml>
      `;
      this.fileName = 'rss.opml';
      const blob = new Blob([content]);
      this.fileUrl = URL.createObjectURL(blob);
    },

    getOpmlItem(rssItem) {
      let retStr = `
        <outline`;

      Object.keys(rssItem).forEach(item => {
        let val = rssItem[item];
        if (['htmlUrl', 'icon', 'xmlUrl'].includes(item)) {
          val = encodeURIComponent(val);
        }

        retStr += ` ${item}="${val}" `;
      });

      retStr += '/>';

      return retStr;
    }
  }
};
</script>


<template>
  <div class="page">
    <div class="rss-origin-list">
      <input id="file" type="file" value="引入yml" @input="bindInput" />

      <a :href="fileUrl" :download="fileName">下载文件</a>

      <div
        v-for="(item, index) in rssOriginList"
        :key="index"
        class="info"
        @click="() => bindRssClick(index)"
      >
        <img :src="item.icon" alt="" />
        <div class="name">{{ item.title }}</div>
      </div>
    </div>

    <div class="article-list">
      <div
        v-for="(item, i) in articleList"
        :key="i"
        class="item"
        @click="() => bindArticleClick(item)"
      >
        <p class="title">{{ item.title }}</p>
        <p class="desc">{{ item.contentSnippet }}</p>
        <p class="time">{{ item.isoDate }}</p>
      </div>
    </div>

    <div class="content-wrap">
      <h3 class="title">{{ title }}</h3>
      <article class="content" v-html="content"></article>
    </div>
  </div>
</template>
