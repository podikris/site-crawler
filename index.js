var Crawler = require("crawler");

var c = new Crawler({
  maxConnections: 10,
});

var store;

var crawl = function (crawler, pageNum, store = []) {
  c.queue([
    {
      uri: "https://timemanagementninja.com/blog/page/" + pageNum,
      jQuery: true,

      // The global callback won't be called
      callback: function (error, res, done) {
        if (error) {
          console.log(error);
        } else {
          var $ = res.$;
          var entries = $(
            ".post-list > article .entry-header > .entry-title > a"
          );
          console.log(
            "Found " + entries.length + " entries on page: " + pageNum
          );
          for (var position = 0; position < entries.length; position++) {
            if (
              entries[position].attribs &&
              entries[position].attribs.href &&
              entries[position].children &&
              entries[position].children[0] &&
              entries[position].children[0].data
            ) {
              store.push({
                title: entries[position].children[0].data
                  .replace(/\t/g, "")
                  .replace(/\n/g, ""),
                link: entries[position].attribs.href,
              });
              //   console.log({
              //     title: entries[position].children[0].data
              //       .replace(/\t/g, "")
              //       .replace(/\n/g, ""),
              //     link: entries[position].attribs.href,
              //   });
            }
          }
          console.log("Added page: " + pageNum);

          if ($(".nav-links > .nav-previous").length > 0) {
            crawl(crawler, pageNum + 1, store);
          } else {
            console.log("Total entries found: " + store.length);
            console.log(store);
          }
        }
        done();
      },
    },
  ]);
};

crawl(c, 1);
