let porgifyImgs = [
  "https://lumiere-a.akamaihd.net/v1/images/porg_f5e77ddb.jpeg",
  "https://vignette.wikia.nocookie.net/starwars/images/b/b4/Porg_D23_behind_the_scenes.png/revision/latest?cb=20170915155325",
  "http://www.theforce.net/2017/porgsonisland.jpg",
  "https://i.redd.it/benc3bhartaz.jpg",
  "https://i.imgur.com/MTUjrdX.jpg",
  "https://fsmedia.imgix.net/ce/78/f7/42/2c4f/442c/a8ce/2391c08f375c/threatofskywalkerpng.png?rect=9%2C25%2C1975%2C659&auto=format%2Ccompress&w=650",
  "http://www.starwarsreport.com/wp-content/uploads/2017/08/20930930_10100926202255689_605769706_o-e1503589233510-809x1024.png",
  "https://i.pinimg.com/originals/03/5c/62/035c622a970512a18bb99b250041aa43.jpg",
  "https://static1.squarespace.com/static/51b3dc8ee4b051b96ceb10de/t/59de5d077131a57342840a74/1507745034779/heres-a-large-and-ridiculous-collection-of-porg-humor-that-has-flooded-the-internet27.jpg",
  "http://starwarsblog.starwars.com/wp-content/uploads/2018/03/porg-puffs-tall.jpg",
  "https://www.cbr.com/wp-content/uploads/2017/09/star-wars-the-last-jedi-porg-millennium-falcon-header.jpg",
  "https://i.pinimg.com/736x/6d/9e/50/6d9e50987ee1c42fb87e5ff86a1afa68.jpg",
  "https://static1.squarespace.com/static/544a89a9e4b03e16957adb96/58cd5646bf629a7051c58d2f/59e0a4ead55b41c2c7c7b8ff/1507904608158/Porg-Jedi_sm.png",
],

// set a random image from lstImgs to item
setRandomImg = (imageElem) => {
  var h = imageElem.height;
  var w = imageElem.width;
  imageElem.style.width = w + "px"
  imageElem.style.height = h + "px"
  imageElem.src = porgifyImgs[Math.floor(Math.random() * porgifyImgs.length)];
}

// if image is broken, remove it so it is not used again
// also reassign image with one that works
handleBrokenImg = (imageElem) => {
  var brokenImg = imageElem.src;
  var index = porgifyImgs.indexOf(brokenImg);
  if (index > -1) {
    porgifyImgs.splice(index, 1);
  }
  setRandomImg(item, porgifyImgs);
}

// replace one image
handleImg = (imageElem) => {
  imageElem.onerror = () => {
    // handle broken imgs
    // in the case that one of the included image links breaks
    handleBrokenImg(imageElem);
  }

  setRandomImg(imageElem);
}

// handles all images on page
handleImages = () => {
  let imagesOnPage = document.getElementsByTagName("img");

  // skip if the image was already replaced
  for (let imageElem of imagesOnPage) {
    if (porgifyImgs.findIndex(url => url == imageElem.currentSrc) !== -1) {
      continue;
    }

    var h = imageElem.height;
    var w = imageElem.width;

    if (h > 0 && w > 0) {
      // replace immediatly if loaded
      handleImg(imageElem);
    } else {
      // wait for image to load to replace
      imageElem.onload = () => {
        // prevent infinite loop
        if (porgifyImgs.findIndex(url => url == imageElem.currentSrc) == -1) {
          handleImg(imageElem);
        }
      }
    }
  }
}

// loops handleImages at a given interval of time
main = () => {
  handleImages();

  const cooldown = 3000
  setInterval(function() {
    handleImages();
  }, cooldown);
}

// start
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
