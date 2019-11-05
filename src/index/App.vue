<template>
  <div class="page">
    <div class="rss-origin-list">
      <input id="file" type="file" value="引入yml" @input="bindInput" />

      <div
        class="info"
        v-for="(item, index) in rssOriginList"
        v-bind:key="index"
        @click="() => bindRssClick(index)"
      >
        <img :src="item.icon" alt="" />
        <div class="name">{{ item.title }}</div>
      </div>
    </div>

    <div class="article-list">
      <div
        class="item"
        v-for="(item, i) in articleList"
        v-bind:key="i"
        @click="() => bindArticleClick(item)"
      >
        <p class="title">{{ item.title }}</p>
        <p class="desc">{{ item.contentSnippet }}</p>
        <p class="time">{{ item.isoDate }}</p>
      </div>
    </div>

    <div class="content-wrap">
      <h3 class="title">{{ title }}</h3>
      <article v-html="content" class="content"></article>
    </div>
  </div>
</template>
<script>
import RssParser from 'rss-parser';
import xmlStrToJsonObj from 'src/utils/xml2Json';

const rssArticles = [];

export default {
  name: 'index',
  data() {
    return {
      rssOriginList: [],
      articleList: [],
      content: '',
      title: ''
    };
  },

  mounted() {
    chrome.storage.sync.get({ rssOriginList: [] }, res => {
      this.rssOriginList = res.rssOriginList;

      if (res.rssOriginList.length) {
        const parser = new RssParser();
        res.rssOriginList.forEach((item, index) => {
          parser.parseURL(item.xmlUrl, (err, feed) => {
            if (err) throw err;

            rssArticles[index] = feed.items;
            // let main = '';
            // feed.items.forEach(function(entry) {
            //     main += JSON.stringify(entry)
            //     console.log(entry.title + ':' + entry.link);
            // })
            // document.getElementById('main').innerHTML = main;
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

        jsonObj.opml.body.outline.forEach(item => {
          // const {title, xmlUrl} = item['@attributes'];
          const newItem = item['@attributes'];
          newItem.icon = `${newItem.htmlUrl}favicon.ico`;
          self.rssOriginList.push(newItem);
        });

        chrome.storage.sync.set({ rssOriginList: self.rssOriginList });
      };
      reader.readAsText(file);
    },

    bindRssClick(i) {
      this.articleList = rssArticles[i];
    },

    bindArticleClick(item) {
      this.title = item.title;
      this.content = item.content;
    }
  }
};
</script>
