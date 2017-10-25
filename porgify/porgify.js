let active = true;

try {
  chrome.storage.sync.get({
    activate: true
  }, function(items) {
    active = items.activate;
    if (active) {
      main();
    }
  });
} catch (e) {
  if (active) {
    main();
  }
}

//Content script, image replacer
function main() {

  //porgify
  (function($) {
    var self = {
      porgifyImgs: [
        "http://www.altpress.com/images/uploads/news/News/porgheader.jpeg",
        "https://lumiere-a.akamaihd.net/v1/images/porg_f5e77ddb.jpeg",
        "https://images.moviepilot.com/images/c_fill,h_270,w_480/t_mp_quality_gif/o3okvyopq9odrlmjtibt/people-are-going-to-want-a-porg-as-a-pet-lucasfilm-explains-the-cutest-star-wars-creatu-1471310.jpg",
        "https://vignette.wikia.nocookie.net/starwars/images/b/b4/Porg_D23_behind_the_scenes.png/revision/latest?cb=20170915155325",
        "http://www.theforce.net/2017/porgsonisland.jpg",
        "https://i.redd.it/benc3bhartaz.jpg",
        "https://i.imgur.com/MTUjrdX.jpg",
        "https://fsmedia.imgix.net/ce/78/f7/42/2c4f/442c/a8ce/2391c08f375c/threatofskywalkerpng.png?rect=9%2C25%2C1975%2C659&auto=format%2Ccompress&w=650",
        "http://www.starwarsreport.com/wp-content/uploads/2017/08/20930930_10100926202255689_605769706_o-e1503589233510-809x1024.png",
        "https://i.amz.mshcdn.com/YdhmJEcRrPEWSyFA_02erWPwahw=/fit-in/1200x9600/https%3A%2F%2Fblueprint-api-production.s3.amazonaws.com%2Fuploads%2Fcard%2Fimage%2F617791%2F3983a983-bb0a-4ec2-bedc-f5d978a202f2.jpg",
        "https://i.pinimg.com/originals/03/5c/62/035c622a970512a18bb99b250041aa43.jpg",
        "https://static1.squarespace.com/static/51b3dc8ee4b051b96ceb10de/t/59de5d077131a57342840a74/1507745034779/heres-a-large-and-ridiculous-collection-of-porg-humor-that-has-flooded-the-internet27.jpg",
      ],

      //Handles all images on page with an interval of time
      handleImages(lstImgs, time) {
        $.each($("img"), function(i, item) {
          //Skip if image is already replaced
          if ($.inArray($(item).attr("src"), lstImgs) === -1) {
            var h = $(item).height();
            var w = $(item).width();

            //If image loaded
            if (h > 0 && w > 0) {

              self.handleImg(item, lstImgs);
            } else {
              //Replace when loaded
              $(item).load(function() {
                //Prevent infinite loop
                if ($.inArray($(item).attr("src"), lstImgs) == -1) {
                  self.handleImg(item, lstImgs);
                }
              });
            }
          }
        });

        //Keep replacing
        if (time > 0) {
          setTimeout(function() {
            self.handleImages(lstImgs, time);
          }, time);
        }
      },
      //Replace one image
      handleImg(item, lstImgs) {
        $(item).error(function() {
          //Handle broken imgs
          self.handleBrokenImg(item, lstImgs);
        });

        self.setRandomImg(item, lstImgs);
      },
      //Set a random image from lstImgs to item
      setRandomImg(item, lstImgs) {
        var h = $(item).height();
        var w = $(item).width();
        $(item).css("width", w + "px").css("height", h + "px");
        $(item).attr("src", lstImgs[Math.floor(Math.random() * lstImgs.length)]);
      },
      //Removed broken image from lstImgs, run handleImg on item
      handleBrokenImg(item, lstImgs) {

        var brokenImg = $(item).attr("src");
        var index = lstImgs.indexOf(brokenImg);
        if (index > -1) {
          lstImgs.splice(index, 1);
        }
        self.setRandomImg(item, lstImgs);
      },
    };

    //Run on jQuery ready
    $(function() {

      self.handleImages(self.porgifyImgs, 3000);

    });

    //Set global variable
    $.porgify = self;


  })(jQuery);
  //end porgify
}
