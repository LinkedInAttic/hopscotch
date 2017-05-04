## Change Log

### v0.2.8 (2017/05/04)
 * [#323](https://github.com/linkedin/hopscotch/pull/323) Fix the rest of the deprecated gradient warnings

### v0.2.7 (2017/02/24)
 * [#312](https://github.com/linkedin/hopscotch/pull/312) Generate templates without `with` keyword (now strict compatible)
 * [#307](https://github.com/linkedin/hopscotch/pull/307) Avoid "Gradient has outdated syntax" error
 * [#320](https://github.com/linkedin/hopscotch/pull/320) [Chore] Refactor notice; Bump year

### v0.2.6 (2016/07/01)
 * [#287](https://github.com/linkedin/hopscotch/pull/287) Add new items to .gitignore (ported over from gh72).
 * [#275](https://github.com/linkedin/hopscotch/pull/275) Update jasmine version in package.json
 * [#273](https://github.com/linkedin/hopscotch/pull/273) Fix unlisten method (wrong callback equals)
 * [#253](https://github.com/linkedin/hopscotch/pull/253) Improve documentation of the target attribute of step elements.
 * [#280](https://github.com/linkedin/hopscotch/pull/280) Miss a variable declaration
 * [#291](https://github.com/linkedin/hopscotch/pull/291) Add error callback for showStep (Issue #274)

### v0.2.5 (2015/07/20)
 * [#188](https://github.com/linkedin/hopscotch/pull/188) [GH-188] No event called after tour is finished
 * [#193](https://github.com/linkedin/hopscotch/pull/193) [GH-190] Close button should be a button
 * [#187](https://github.com/linkedin/hopscotch/pull/187) [GH-24] Recover when tour bubble DOM element is destroyed
 * [#183](https://github.com/linkedin/hopscotch/pull/183) Remove moot `version` property from bower.json
 * [#181](https://github.com/linkedin/hopscotch/pull/181) Remove all styling from hopscotch.less
 * [#182](https://github.com/linkedin/hopscotch/pull/182) [GH-175] totalSteps should be i18n-ified
 * [#178](https://github.com/linkedin/hopscotch/pull/178) [GH-177] Require existing target element for stand-alone callouts
 * [#176](https://github.com/linkedin/hopscotch/pull/176) [GH-172] documentIsReady is when document.readyState is complete

### v0.2.4 (2015/04/28)
 * [#168](https://github.com/linkedin/hopscotch/pull/168) Gracefully handle steps without valid target
 * [#167](https://github.com/linkedin/hopscotch/pull/167) Hide previous button on first step, even if steps are skipped.
 * [#153](https://github.com/linkedin/hopscotch/pull/153) Tour ID as part of classes
 * [#151](https://github.com/linkedin/hopscotch/pull/151) Add support for AMD and CommonJS
 * [#146](https://github.com/linkedin/hopscotch/pull/146) Check tour & callout IDs for invalid characters
 * [#142](https://github.com/linkedin/hopscotch/pull/142) Simple bower config file added.

### v0.2.3 (2014/12/10)

 * [#139](https://github.com/linkedin/hopscotch/pull/139) RefreshBubblePosition updates all known callouts
 * [#136](https://github.com/linkedin/hopscotch/pull/136) Ignore skipped steps in numbering
 * [#137](https://github.com/linkedin/hopscotch/pull/137) NextOnTarget Click event not always removed
 * [#133](https://github.com/linkedin/hopscotch/pull/133) Add right-to-left support to hopscotch
 * [#128](https://github.com/linkedin/hopscotch/pull/128) Trailing comma in opts.i18n object
 * [#126](https://github.com/linkedin/hopscotch/pull/126) Revert defuault z-index to empty vs auto
 * [#102](https://github.com/linkedin/hopscotch/pull/102) Callbacks on callouts do not work


### v0.2.2 (2014/06/26)

 * [#91](https://github.com/linkedin/hopscotch/pull/91) Don't cache step targets - support for single page apps
 * [#96](https://github.com/linkedin/hopscotch/pull/96) box-sizing: content-box - Issues with Bootstrap 3
 * [#90](https://github.com/linkedin/hopscotch/pull/90) Prefer jQuery and Sizzle when searching for a target
 * [#94](https://github.com/linkedin/hopscotch/pull/94) Catch exceptions caused by illegal targets in document.QuerySelector

### v0.2.1 (2014/06/05)

 * [#82](https://github.com/linkedin/hopscotch/pull/82) IE8 Button Bindings Fix
 * [#87](https://github.com/linkedin/hopscotch/pull/87) Fix blank z-index for value 0
 * [#89](https://github.com/linkedin/hopscotch/pull/89) Fix sessionStorage exceeds quota error in Safari

### v0.2.0 (2014/03/24)

 * [#70](https://github.com/linkedin/hopscotch/pull/70) Rendering tour & callout bubbles using compiled templates (@zimmi88)
 * [#62](https://github.com/linkedin/hopscotch/pull/62) Add method to redraw the bubble at a new position (@cedrics)
 * [#64](https://github.com/linkedin/hopscotch/pull/64) Add changelog (@kate2753)
 * [#61](https://github.com/linkedin/hopscotch/pull/61) Reorganize repo and automate release process, travis integration


### v0.1.3 (2014/03/04)

 * [aaca52b](https://github.com/linkedin/hopscotch/commit/aaca52bc2fcb254f65a5b0e3173635de7c9bb8d6) Update README: add explanation for the getCurrTarget() (@gnatok)
 * [d5894b2](https://github.com/linkedin/hopscotch/commit/d5894b24150597d38b6225e0b6040887d531a66c) Move window.sessionStorage into try catch block. (@nanek)
 * [35a2b2d](https://github.com/linkedin/hopscotch/commit/35a2b2d4f334cbb191899b860d4be80d420d4dcc) detect when a onNext/onPrev callback updates tour state (@gkoo)
 * [4c025eb](https://github.com/linkedin/hopscotch/commit/4c025ebf16023ce1e74dbfd34cf89cc9bbbd8ebb) a little cleanup from the previous commit (@gkoo)
 * [25140fb](https://github.com/linkedin/hopscotch/commit/25140fb3d1488930e0698093fb4e2e675b5108b8) Changed logic to check for typeof currStepNum. Forcing tour to start at step 0 was not working. (@leedavidr)
 * [bc2af92](https://github.com/linkedin/hopscotch/commit/bc2af92d025823decb3be3a3c32670c50cb45592) makes onCTA use callback helpers (@yeah)
 * [7791d6f](https://github.com/linkedin/hopscotch/commit/7791d6f346e1b2849894878aba48725199fb709a) Small doc update for query selectors. (@marc-hughes)
 * [0fbef13](https://github.com/linkedin/hopscotch/commit/0fbef13779df5dcf4586d3b36747f883a183326b) Support arbitrary selectors for targets (@joshjordan)


### v0.1.2 (2013/09/16)

 * [6e2ec18](https://github.com/linkedin/hopscotch/commit/6e2ec18a0c61cc4063a3af76c4c80982bf4d0dfe) add jshint to grunt (@gkoo)
 * [ee28d20](https://github.com/linkedin/hopscotch/commit/ee28d20fb4441862a0737bed884dda4431e3dc63) add CLI testing, add tests to grunt (@gkoo)
 * [1f8e065](https://github.com/linkedin/hopscotch/commit/1f8e065e856586eec1b2b240a4cdbb3fcba66189) Update CONTRIBUTING.md (@gkoo)
 * [02694a6](https://github.com/linkedin/hopscotch/commit/02694a6d032e173fd6a76a0d06fef31a3f148758) Update CONTRIBUTING.md (@gkoo)
 * [e802bac](https://github.com/linkedin/hopscotch/commit/e802bac53df2bc35219454865a9aaf3e389b4d6e) Fix for issue #17 (@gkoo)
 * [70b2974](https://github.com/linkedin/hopscotch/commit/70b29741dd0e754e139150b04c12a31a6bafe804) halt tour when onNext/onPrev returns false (@gkoo)
 * [3fcdfdd](https://github.com/linkedin/hopscotch/commit/3fcdfdd9075cb4347444048d4b7b85c69f362f69) add getCurrTarget function that return current target object (@gnatok)
 * [a6265d2](https://github.com/linkedin/hopscotch/commit/a6265d2f0295635a35b240a081a9f12675057259) bump version num (@gkoo)


### v0.1.1 (2013/07/14)

 * [aa1d028](https://github.com/linkedin/hopscotch/commit/aa1d028e8fae337144e3f71cfc5b4f1dc42adc11) added some comments for _setupCTAButton() (@gkoo)
 * [d806e11](https://github.com/linkedin/hopscotch/commit/d806e11dc7bf6050cf9c791a73794a9150db58a9) added invokeHelper() function to use programmatically (@gkoo)
 * [e6639c7](https://github.com/linkedin/hopscotch/commit/e6639c7a79d8cff7168994419638dd316c525171) update version number in demo/index.html (@gkoo)
 * [d2810a8](https://github.com/linkedin/hopscotch/commit/d2810a8abd4bb5b1702b0dfc682ffa97b29a4d62) adjust the screenshot in the README (@gkoo)
 * [bdb5ac8](https://github.com/linkedin/hopscotch/commit/bdb5ac83d04c4d51ef4e2213bf68224de92853fe) add some syntax highlighting for README code examples (@gkoo)
 * [d65e536](https://github.com/linkedin/hopscotch/commit/d65e536b7bdbf79a46c96505a5487e57b4ea7d1f) README syntax highlighting fix (@gkoo)
 * [7caa02d](https://github.com/linkedin/hopscotch/commit/7caa02d3b229314016ca68aab47ced5b0293c233) update CONTRIBUTING.md with LESS file info (@gkoo)
 * [e31af84](https://github.com/linkedin/hopscotch/commit/e31af8458aa8230b77cfbd2b12311ba7805bd4cc) add id tour option to docs (@gkoo)
 * [d3d48ff](https://github.com/linkedin/hopscotch/commit/d3d48ffe02b30fc57293571ac81e851c291e6162) change content to be contained in <div> (@gkoo)
 * [b697322](https://github.com/linkedin/hopscotch/commit/b6973227cc29488e4388987fc2a269bbc3f175d5) add some default styles to protect against external definitions (@gkoo)
 * [f867ea3](https://github.com/linkedin/hopscotch/commit/f867ea3043397b047f0240268fca844e7a3c6871) add minify script for dev (@gkoo)
 * [a6f0962](https://github.com/linkedin/hopscotch/commit/a6f09626df0d1d57b1b902675658a63122cdce30) add a center option for xOffset and yOffset (@gkoo)
 * [be5f972](https://github.com/linkedin/hopscotch/commit/be5f972d81fc09cd2821eab2a316ab95322a48f9) add center option for arrowOffset (@gkoo)
 * [4379a5f](https://github.com/linkedin/hopscotch/commit/4379a5f07b3a87d1c3d6db627ff85dc9d10c8d64) add docs for 'center' config options (@gkoo)
 * [d2deccd](https://github.com/linkedin/hopscotch/commit/d2deccd88e608102b8ea67a9d117a7d5a52ae427) fix how centers are calculated (@gkoo)
 * [d904b51](https://github.com/linkedin/hopscotch/commit/d904b51ed9eefc88b655fff5d9367710e6ff4223) Remove ":mp" from multipage state. (@gkoo)
 * [7847946](https://github.com/linkedin/hopscotch/commit/78479465686904d13a4f2d1ef484bca5a5e1bb27) make nextOnTargetClick trigger next callback (@gkoo)
 * [e19d872](https://github.com/linkedin/hopscotch/commit/e19d8721a2e7446ce1d4ac592aa79ad0a14b1323) get rid of decrement in findStartingStep (@gkoo)
 * [1925ac8](https://github.com/linkedin/hopscotch/commit/1925ac833fab390a9a808f2ed6d6c36060506bd7) fixed animate to use global jQuery object (useful when $ conflicts on page) (@leom)
 * [55c7625](https://github.com/linkedin/hopscotch/commit/55c7625704b320221c94764fc7ff49ae9f1b87ad) update minified js for jQuery noconflict (@gkoo)
 * [b9ac2f8](https://github.com/linkedin/hopscotch/commit/b9ac2f8292b1c3ad1274fb73a6099a236cd66ce3) add grunt for uglify and less (@gkoo)
 * [d08c69d](https://github.com/linkedin/hopscotch/commit/d08c69d8cd069c5a1c2e16988f9535b63f87e4a0) update demo page (@gkoo)
 * [e88ab97](https://github.com/linkedin/hopscotch/commit/e88ab97e3ebd3d0cb12a8d6ea8cabc81a0508a50) remove 0.1.min (@gkoo)
 * [c826961](https://github.com/linkedin/hopscotch/commit/c826961335a2426794267431d07c746f9ef8bf5d) fix bug with IE8 getBoundingClientRect.width and height (@gkoo)
 * [8f2b41c](https://github.com/linkedin/hopscotch/commit/8f2b41ca6bea37be76df03eab21a98c6f5455e33) bump version numbers (@gkoo)



### v0.1.0 (2013/05/15)

 * [e7273e0](https://github.com/linkedin/hopscotch/commit/e7273e0f84056c86802f03ebc4323c5c8feb490e) fix onShow not executed when step.fixedElement (@gkoo)
 * [4ba10c1](https://github.com/linkedin/hopscotch/commit/4ba10c165d39f5e799486157f2769bd53d8f3917) make jshint happy. fix callouts not showing on creation. (@gkoo)
 * [3b85892](https://github.com/linkedin/hopscotch/commit/3b858928c5cb6ad56dd7912ac59b1adb85cfbf33) update minify script to point to the new less location (@gkoo)
 * [ed6d7e8](https://github.com/linkedin/hopscotch/commit/ed6d7e8d7bd86a728840ac67d8210df4d4e5c090) jshintify Sizzle, turn input buttons to regular buttons (@gkoo)
 * [b968090](https://github.com/linkedin/hopscotch/commit/b9680904e5ebe5cc59f4315b88767e8a4ca85443) Create helpers API for callbacks (@gkoo)
 * [7426f30](https://github.com/linkedin/hopscotch/commit/7426f3041bf396c57a93c08a3a7e468648da89e8) update minified JS (@gkoo)
 * [a377b2b](https://github.com/linkedin/hopscotch/commit/a377b2b751df69b5ad76aabf5db530a262248658) update sprite to latest - * v0.3 (@gkoo)
 * [ed78265](https://github.com/linkedin/hopscotch/commit/ed7826554521134afa01520e43ea092d54bdc895) fix error when hopscotch is included in the head, instead of end of body (@gkoo)
 * [d117e95](https://github.com/linkedin/hopscotch/commit/d117e95b2cb5c32c41fadba5125c67de7a9c16fa) use Array.isArray if available for utils.isArray (@gkoo)
 * [e73c4e5](https://github.com/linkedin/hopscotch/commit/e73c4e5c43e359292f03a925d548bb3690f5e1ec) move onShow callback to invoke after bubble actually shows (in case of windowScroll) (@gkoo)
 * [e2e37f1](https://github.com/linkedin/hopscotch/commit/e2e37f1dc178013c388ce22fdb23899da4e9e46b) add a CTA button for Hopscotch callouts (and tour steps, I guess) (@gkoo)
 * [0bcba90](https://github.com/linkedin/hopscotch/commit/0bcba90da07827042ce3b440c6eaf2e6fb6b860f) update demo page for callout CTA example (@gkoo)
 * [d87ef47](https://github.com/linkedin/hopscotch/commit/d87ef4709a49bb92b7645ae2335dc744aa3405a4) add a document variable (@gkoo)
 * [74bdfb8](https://github.com/linkedin/hopscotch/commit/74bdfb8a3764f2e638ac301a50592551937b130d) change Array.isArray backfill (@gkoo)
 * [f346215](https://github.com/linkedin/hopscotch/commit/f34621508c49987f1117e67fec8202ca935c701b) invoke tour-wide callbacks first, then step-specific callbacks (@gkoo)
 * [f2581a6](https://github.com/linkedin/hopscotch/commit/f2581a64c184b31bc57b230f0844079b057a3862) Some fixes (@gkoo)
 * [41ced7b](https://github.com/linkedin/hopscotch/commit/41ced7b148802799b11538f8bdcf527d1de175f3) Support multiple targets for a step. (@zimmi88)
 * [d462e59](https://github.com/linkedin/hopscotch/commit/d462e59a8a5c355d22dd0d021cb5e3076862a059) Whoops, remove debug code. (@zimmi88)
 * [342aafb](https://github.com/linkedin/hopscotch/commit/342aafb5869a6d12d62b429024e087a3b545d097) Move runTargetTest into utils. (@zimmi88)
 * [c1f74b7](https://github.com/linkedin/hopscotch/commit/c1f74b7526af325714e10510f080b3ad298fc995) Fix var typo. (@zimmi88)
 * [bc3b9a5](https://github.com/linkedin/hopscotch/commit/bc3b9a5ca929117dd1019c826a94c4d9319887d9) add support for multiple step targets, fix a bug with missing first step target (@gkoo)
 * [226fc18](https://github.com/linkedin/hopscotch/commit/226fc1810468ae88394cc3b81ab645aeb3f8c68d) undo the global/local callback reordering (@gkoo)
 * [3f63619](https://github.com/linkedin/hopscotch/commit/3f6361966dd85500b3ab68488b5f3a7dcff61b08) some fixes to CTA button (@gkoo)
 * [6f00b11](https://github.com/linkedin/hopscotch/commit/6f00b110c711c70933a3a1a7999bfba42d7ae438) check backwards-direction multipage, for when onPrev wants to go to previous page (@gkoo)
 * [a231d78](https://github.com/linkedin/hopscotch/commit/a231d787f4e5db1ac618b6af7e6e6447e2559798) adding a generic utils.addEvtListener helper function (@gkoo)
 * [8615858](https://github.com/linkedin/hopscotch/commit/86158582e9cbe4f53ea69fef79034684746b30aa) fix cookie tour step overriding startTour param (@gkoo)
 * [0cfba19](https://github.com/linkedin/hopscotch/commit/0cfba19ffdb0a7d494807a7ee75a96cbd1a7060d) fix gradient mixin for IE (@gkoo)
 * [6fa65a0](https://github.com/linkedin/hopscotch/commit/6fa65a0d31e2a4f286a537f4a011d7aa8748b345) improve addClass and removeClass util fns (@gkoo)
 * [0ec9d92](https://github.com/linkedin/hopscotch/commit/0ec9d92c4905af62fad904706ab4d4a0377c55f5) added README (@gkoo)
 * [f320f02](https://github.com/linkedin/hopscotch/commit/f320f02d21ed62c6c6376055483feec816f1a3e7) Fix bug where tour doesn't start if the saved step is the last step on a (@gkoo)
 * [dc9e93e](https://github.com/linkedin/hopscotch/commit/dc9e93ea2c9e52f3a4dc64907d5738427765a592) Wrote first tests and fixed some bugs (@gkoo)
 * [b27f16a](https://github.com/linkedin/hopscotch/commit/b27f16a103f144adacd0f5b30030e5926b886733) A lot of tests and fixes for bugs uncovered. (@gkoo)
 * [423e8a9](https://github.com/linkedin/hopscotch/commit/423e8a99fe225ca7594f966b659d410cdc406c61) Added tests for Hopscotch callouts (@gkoo)
 * [2e94706](https://github.com/linkedin/hopscotch/commit/2e94706ea5399b0647f2ba897cb611fc9c952988) cleanup junk files (@gkoo)
 * [fde8f11](https://github.com/linkedin/hopscotch/commit/fde8f11fb0129c342ed7a6618b370843c0152c6d) Create demo page, update some tour options (@gkoo)
 * [adfc4ae](https://github.com/linkedin/hopscotch/commit/adfc4aeed8fbdfa3d1982787d6c66890ec92a91b) reorganize test directory (@gkoo)
 * [a285997](https://github.com/linkedin/hopscotch/commit/a28599708e2bae1837d4c08d46c7d26d75588e30) add license, attribution, and comments to LESS files (@gkoo)
 * [5f3a572](https://github.com/linkedin/hopscotch/commit/5f3a572d10780d8a9c06f288ebb6c8aafc322a70) rename screenshot, put at top of README (@gkoo)
 * [cbf0f87](https://github.com/linkedin/hopscotch/commit/cbf0f8757ae5c236a7b1f0370c2532833147696e) update licensing info for fade.less (@gkoo)
 * [19f5850](https://github.com/linkedin/hopscotch/commit/19f58500c9f0d1fabc6b4d9ab0f513fe17a04e4a) add licensing for buttons.less (@gkoo)
 * [50ca76b](https://github.com/linkedin/hopscotch/commit/50ca76bcf42db08a657b708d0ef96b3109271cd5) added table of contents to demo page (@gkoo)
 * [26e630d](https://github.com/linkedin/hopscotch/commit/26e630d71f74d664e0d018428210773c4748643d) add Hopscotch Callouts to demo TOC (@gkoo)
 * [d2cae5e](https://github.com/linkedin/hopscotch/commit/d2cae5ea54c680a4e65b60d37b3b216fe532e164) make CTA button callback to close automatically (@gkoo)
 * [cba5193](https://github.com/linkedin/hopscotch/commit/cba5193103dc1a8e915c1eb9ba14129be41ff8cd) update minified hopscotch (@gkoo)
 * [5d6384f](https://github.com/linkedin/hopscotch/commit/5d6384f83b0b4ae2c223ee453ac0e883b8f55dce) bump version to 0.1 (@gkoo)


### v0.0.5 (2013/03/08)

 * [eb26699](https://github.com/linkedin/hopscotch/commit/eb26699ff4d494fe22562d3589362b56e83a3d05) merge
 * [5765f75](https://github.com/linkedin/hopscotch/commit/5765f75b7fe0c397ea5bc498a0844620b1857520) fix a scoping bug (@gkoo)
 * [3955216](https://github.com/linkedin/hopscotch/commit/3955216fd900f8e0ccc0f0d35e626c7364e65851) add check for duplicate callout id (@gkoo)
 * [bc7a1ce](https://github.com/linkedin/hopscotch/commit/bc7a1cecca5770d32b122c547e8af4236b3ef3e0) change the way top-oriented bubbles are rendered (@gkoo)
 * [51966a9](https://github.com/linkedin/hopscotch/commit/51966a95424ec732484c551d2ad067378fba9ab6) fix self.show ==> this.show (@gkoo)
 * [89f87e2](https://github.com/linkedin/hopscotch/commit/89f87e2ec1c12c7438def39e37ffdc41363eef06) add onClose for callouts (@gkoo)
 * [92082ff](https://github.com/linkedin/hopscotch/commit/92082ff1f39e0ff4e466e0d11f22eab4a0603f6f) remove unused css/less (@gkoo)
 * [bc45ab1](https://github.com/linkedin/hopscotch/commit/bc45ab1a9716820e794749559de6c6e928f8a2ea) prevent nextStep() from progressing tour after multistep is detected (@gkoo)
 * [7237f76](https://github.com/linkedin/hopscotch/commit/7237f76dc587708047da2b9f696703443f0e1c7b) some jshint fixes (@gkoo)
 * [72bc5d6](https://github.com/linkedin/hopscotch/commit/72bc5d6ee92fbc20c88abb20f05b71e5cb4b9265) fix onNext for multiPage steps
 * [1c67d5c](https://github.com/linkedin/hopscotch/commit/1c67d5c83010d558312d31c6e28cce39f95d8a25) fix cookie name reset issue (@gkoo)
 * [71393d3](https://github.com/linkedin/hopscotch/commit/71393d3e30ff40af37df8f0890dd6a7facae0397) CSS touch-ups (@gkoo)
 * [d3e40de](https://github.com/linkedin/hopscotch/commit/d3e40dea636256d57ce01fa54341a71d7410f744) added katy button styles, update sprites (@gkoo)
 * [f9bc1bb](https://github.com/linkedin/hopscotch/commit/f9bc1bbca0db955891573e8fb69cf1c64f2a7b65) updated less to point to the right sprite (@gkoo)
 * [00abc0e](https://github.com/linkedin/hopscotch/commit/00abc0eb0c1e710bc1721a7a9c24726f7414a986) bump version and minify assets (@gkoo)
 * [68465ac](https://github.com/linkedin/hopscotch/commit/68465acf690f8f0a4c8442b7fcdbe25a6bf62ae2) very minor changes. add some padding to close button (@gkoo)


### v0.0.4 (2012/11/19)

 * [8d89672](https://github.com/linkedin/hopscotch/commit/8d89672aec14a829abb4061a14f18f432e4d5742) fix references to hopscotch (@gkoo)
 * [86d8290](https://github.com/linkedin/hopscotch/commit/86d8290f475a415296cf19796c785aa578c1fa41) update docs for goToStepTarget (@gkoo)
 * [aa20fea](https://github.com/linkedin/hopscotch/commit/aa20fea84fa31133192b2fa263d9a1a5a78042db) remove references to substeps and saving state. creating separate branches for them (@gkoo)
 * [c1ee618](https://github.com/linkedin/hopscotch/commit/c1ee618ffcd6e45c7eae055a7bd56d1320a912c6) change HopscotchBubble to prototype structure (@gkoo)
 * [3792474](https://github.com/linkedin/hopscotch/commit/3792474bf74dfa37f219df1b56b81b309221c36e) add HopscotchCalloutManager for creating callouts (@gkoo)
 * [9096eba](https://github.com/linkedin/hopscotch/commit/9096ebae9490833cc2fcb43082e5104874426791) fixed HopscotchBubble.destroy, updated docs (@gkoo)
 * [a2ba602](https://github.com/linkedin/hopscotch/commit/a2ba6020aff708e39101fdcd6d87fc41a503fd6c) bump version to 0.0.4 (@gkoo)


### v0.0.3 (2012/11/12)

 * [3edace8](https://github.com/linkedin/hopscotch/commit/3edace8257d8c7aeb30291199efb3404356c8f9b) fix bug with nextOnTargetClick (@gkoo)
 * [52d9433](https://github.com/linkedin/hopscotch/commit/52d94338a488f7d9470be1db50c06cdbd25487af) fix a bug related to addEventListener for FF <=3.6 (@gkoo)
 * [671989f](https://github.com/linkedin/hopscotch/commit/671989f4d11e95dd7e7b059d102ceec1cfdbb7bc) add support for basic selectors in step target property (@gkoo)
 * [d4bc59a](https://github.com/linkedin/hopscotch/commit/d4bc59a52e610aae0b9b3f9979b9f025b700f8d7) Getting sidewalk chalk updated to latest code. (@theLisa)
 * [91cb5fd](https://github.com/linkedin/hopscotch/commit/91cb5fd92fb23e59633b4a82a2f2ce715a6249bc) Changed "addCallback" to "listen" and fixed getStepTarget (@gkoo)
 * [30efeb6](https://github.com/linkedin/hopscotch/commit/30efeb643a066793a770dedf48dd7a1a72ee4d1f) Fix showPrevButton bug, respect step delay for changeStep (@gkoo)
 * [7ba10d6](https://github.com/linkedin/hopscotch/commit/7ba10d66755ee842a49869203fffbf6113fcdb10) bump version to 0.0.3 (@gkoo)


### v0.0.2 (2012/10/22)

 * [d052302](https://github.com/linkedin/hopscotch/commit/d0523028a7597ac387235dce858da0e599e0d437) change 0.0.1 to 0.1 (@gkoo)
 * [39607c2](https://github.com/linkedin/hopscotch/commit/39607c264472c883433fccb20f45eb6c83c2b9ab) rename hopscotch-0.1.js ==> hopscotch-0.1.dev.js (@gkoo)
 * [98bb776](https://github.com/linkedin/hopscotch/commit/98bb7769a81d9b72da7b5c6d3f24168e24e55471) Adding functionality for sidewalk chalk bookmarklet. It's ugly as hell, but we'll clean it up :) (@theLisa)
 * [f80aa3f](https://github.com/linkedin/hopscotch/commit/f80aa3f8aba3e33c7a42213607e5e3c7de1c30f1) Update to sidewalk chalk functionality. (@theLisa)
 * [1fa7d79](https://github.com/linkedin/hopscotch/commit/1fa7d7915635a25ad66d1bdcfafed1e2d086d3c2) Fixed target element finder and orientation buttons. (@theLisa)
 * [bc9f4c7](https://github.com/linkedin/hopscotch/commit/bc9f4c7c1fddc53c3fe1be1e015beb4a7c9faedd) got rid of scoping bug when no elements are present on the page (@gkoo)
 * [bab2595](https://github.com/linkedin/hopscotch/commit/bab25952d3bd847d834ff72923d0077040e30836) change the hopscotch filename in index.html (@gkoo)
 * [82b1eaa](https://github.com/linkedin/hopscotch/commit/82b1eaa2a7ea9655e75bf984d5d16a1e2290ba67) remove a console.log statement. remove unnecessary minify scripts (@gkoo)
 * [88b2c73](https://github.com/linkedin/hopscotch/commit/88b2c738d52e45e0855a0b4ce2b5c1829d452c99) fixed some things related to skipIfNoElement and step delay (@gkoo)


### v0.0.1 (2012/09/11)

 * [c6f6b98](https://github.com/linkedin/hopscotch/commit/c6f6b984751304cb52735e3a99f822a62ce5dffa) initial commit (@gkoo)
 * [0e11aa8](https://github.com/linkedin/hopscotch/commit/0e11aa8f776b9e8b61887b0d029962fc17e9ffde) Get rid of Hopscotch Manager (@gkoo)
 * [40befd1](https://github.com/linkedin/hopscotch/commit/40befd1c3f03bab3b50e927faaeb143b3df10b16) scroll to bubble when it's out of viewport (@gkoo)
 * [2196489](https://github.com/linkedin/hopscotch/commit/21964894f1bc627eb666788f04aa8e485a2b26df) add a close button to the bubble (@gkoo)
 * [604d8df](https://github.com/linkedin/hopscotch/commit/604d8dfcef508d7efb1a1c8980f3f3f9953bcedd) added next/prev btn callbacks, window autoscroll on targetEl out of bounds as well (@gkoo)
 * [afb3097](https://github.com/linkedin/hopscotch/commit/afb3097401b383783cda6a77b5129bdf1774e56a) use some less annoying callback examples for nav buttons (@gkoo)
 * [b0ecd04](https://github.com/linkedin/hopscotch/commit/b0ecd04f2ad0503d5096e0ef0e91b90e2a6f8328) get demo page ready (@gkoo)
 * [c5a0e59](https://github.com/linkedin/hopscotch/commit/c5a0e59e4e4aed8360fd56fb5f5bf08d5fb545d2) added arrows to bubble, smoothscroll option (@gkoo)
 * [a029fc7](https://github.com/linkedin/hopscotch/commit/a029fc790140ff661086760e02d931662030476c) Bunch of changes (@gkoo)
 * [a75c925](https://github.com/linkedin/hopscotch/commit/a75c9259cb2784147e4b4bf840621cda42e21bc4) Cookie functions, re-position bubble on window resize (@gkoo)
 * [c1c4acd](https://github.com/linkedin/hopscotch/commit/c1c4acd809a24739aac2fdca25fff81479b39b8a) Added multi-page functionality (@gkoo)
 * [1a0884b](https://github.com/linkedin/hopscotch/commit/1a0884b067ea5c2b2983f8f4fa2f234eec6be4d8) disable back buttons for steps that are multipage (@gkoo)
 * [33d38fd](https://github.com/linkedin/hopscotch/commit/33d38fd29169a006a6e73cc923be7c0a2751442e) standardize font for prototype bubble to helvetica (@gkoo)
 * [a9ac625](https://github.com/linkedin/hopscotch/commit/a9ac62511d41281302c0fa6d023929f8b856db58) Added debug panel, callback for every next button, i18n support (@gkoo)
 * [f2e1b89](https://github.com/linkedin/hopscotch/commit/f2e1b89c899a3620944c6f0459097cbbcedd0658) some code cleanup (@gkoo)
 * [f54d05d](https://github.com/linkedin/hopscotch/commit/f54d05da06ea65806b53d0f5f50bab9160a308dc) added bounce to steps (@gkoo)
 * [8ba4005](https://github.com/linkedin/hopscotch/commit/8ba40052f981a645459294e2c9c666c52e1ab4b3) fix bouncing on window resize (@gkoo)
 * [1ec5eea](https://github.com/linkedin/hopscotch/commit/1ec5eea4f750d8cbaa3d6466a0e2e4292c5fa623) change to utils.removeClasses, changed callback naming convention (@gkoo)
 * [91ac815](https://github.com/linkedin/hopscotch/commit/91ac815e3b49429c8c76adbc1472049d2bfb8776) defer tour until window onload (@gkoo)
 * [a0dc126](https://github.com/linkedin/hopscotch/commit/a0dc126599c5617946d792e7862d5a479e2519c2) compile .less files to hopscotch.css (@gkoo)
 * [cc1bd9d](https://github.com/linkedin/hopscotch/commit/cc1bd9d5029144740b5a33a7ee53c3584361debd) added scrollTopMargin config option (@gkoo)
 * [d4a8e29](https://github.com/linkedin/hopscotch/commit/d4a8e2976bb99a43bbab6dc4c714b337e2d0c315) fix arrow position for top-aligned bubbles, fix scroll issue (@gkoo)
 * [04ba9ed](https://github.com/linkedin/hopscotch/commit/04ba9ed8d21e63f520d6bca64afe1470b6d038dd) add some preliminary styles (@gkoo)
 * [993d633](https://github.com/linkedin/hopscotch/commit/993d633852206f5ae1a04e0c76fe84ef699aeb33) remove onload listener. that was stupid.
 * [ed03685](https://github.com/linkedin/hopscotch/commit/ed03685529fc84852328b48698cb4e8c146ce3f8) fix text flickering in webkit, fix bounce right (@gkoo)
 * [8316dba](https://github.com/linkedin/hopscotch/commit/8316dba3fabfe358ee84e849d3b7f32e1dc893d0) fix empty content/title bug (@gkoo)
 * [bd27109](https://github.com/linkedin/hopscotch/commit/bd27109e0b86ea90a6dba2ec45b26baa80bf3e79) make api calls chainable (@gkoo)
 * [fd22841](https://github.com/linkedin/hopscotch/commit/fd22841e3456f02cb89e1ea3d3ba805e3a7fd183) made the arrows (@gkoo)
 * [3cc4ff8](https://github.com/linkedin/hopscotch/commit/3cc4ff8dc09f8b712ccff693e2dbcf48dd932b84) add check for document.readyState, fallback for transparent borders (@gkoo)
 * [32dd422](https://github.com/linkedin/hopscotch/commit/32dd422449b3f5103a249eff8ac211a75bfe2a23) added substep functionality (@gkoo)
 * [e443867](https://github.com/linkedin/hopscotch/commit/e443867bccc0118295d40584ae0be42041416632) change style of back button (@gkoo)
 * [ba5a9ce](https://github.com/linkedin/hopscotch/commit/ba5a9ced2a79c5d7fef714b12ae24b831e6dad56) update minified/compiled js/css (@gkoo)
 * [d33b71c](https://github.com/linkedin/hopscotch/commit/d33b71c2e0986df8fa858073e87781c3e32db769) allow starting a tour from arbitrary step number (@gkoo)
 * [567f85c](https://github.com/linkedin/hopscotch/commit/567f85c4fbd2db90822b3837c181979fb201685a) fix bug with multi-part steps (@gkoo)
 * [ff332bb](https://github.com/linkedin/hopscotch/commit/ff332bb9ab417d9bc32618269f4eb99789830e10) added onStart, onEnd callbacks (@gkoo)
 * [835fc1b](https://github.com/linkedin/hopscotch/commit/835fc1bfc7c9e2e36c2cba72abd4aeb32347b8fb) add getCurrStepNum api calls, change scrollMargin default to 200 (@gkoo)
 * [badbed3](https://github.com/linkedin/hopscotch/commit/badbed368a9390c2538fed3e8b8227b9f5ebabf0) ability to add multiple callbacks (@gkoo)
 * [df9ec11](https://github.com/linkedin/hopscotch/commit/df9ec1137129c64d802c50ccc7330d835fce240a) whooops! hide bubble if not starting tour right away (@gkoo)
 * [06d62e2](https://github.com/linkedin/hopscotch/commit/06d62e2847c3892af8d3dffb4b1951e5b0c22b63) added handling for when target element doesn't exist (@gkoo)
 * [ee53e1e](https://github.com/linkedin/hopscotch/commit/ee53e1e48168816ae6d2ddc152cd6d413ffb06a2) added new sprite, adjusted text alignment (@gkoo)
 * [32c1bfe](https://github.com/linkedin/hopscotch/commit/32c1bfe4f434eca1288c7a201342ac6fc0ec2428) update example tour (@gkoo)
 * [000e05d](https://github.com/linkedin/hopscotch/commit/000e05db66d86556c1bb3165d08d4774451eefd6) update minified resources (@gkoo)
 * [3274094](https://github.com/linkedin/hopscotch/commit/327409442fcff91fba67a26c15b35540f510f4fb) added skip button option (@gkoo)
 * [1fa2c3d](https://github.com/linkedin/hopscotch/commit/1fa2c3d90755dfb553bcf3427b9e6c86efb574b8) fix arrow width (@gkoo)
 * [32134b6](https://github.com/linkedin/hopscotch/commit/32134b6c9ec582fb0e42718cc43758376975edac) added getCurrTour function (@gkoo)
 * [f0a08a5](https://github.com/linkedin/hopscotch/commit/f0a08a513101539bb7326fb75f74c4cc7a09ad38) added jquery version (@gkoo)
 * [399e97a](https://github.com/linkedin/hopscotch/commit/399e97a94e3980c407e37b50c5ffa13610be046e) added close callback (@gkoo)
 * [28c1a1e](https://github.com/linkedin/hopscotch/commit/28c1a1eb543282695f9d45759e3e8149d4823d70) get rid of some references to jquery in vanilla hopscotch (@gkoo)
 * [2191c03](https://github.com/linkedin/hopscotch/commit/2191c036e1ed4ac2094e6f59c19d4ad6748843c3) adding some return this's
 * [9be5105](https://github.com/linkedin/hopscotch/commit/9be5105cc0b0ae89d9b345a24bbadef86666f1db) update minified js (@gkoo)
 * [204b075](https://github.com/linkedin/hopscotch/commit/204b0751907e03c23223e7bbc709d224e2eb5378) change localStorage to sessionStorage (@gkoo)
 * [dd5d21b](https://github.com/linkedin/hopscotch/commit/dd5d21b8611268142e4ef72d23d5f41123e520d8) add return this to hopscotch.configure (@gkoo)
 * [b2601b1](https://github.com/linkedin/hopscotch/commit/b2601b1437e6c9708caeac4ee91dbb532ea16514) gah. need to hide bubble if not starting tour right awy (@gkoo)
 * [5de8755](https://github.com/linkedin/hopscotch/commit/5de8755e7d4cf7ea5bd839e29af9f8572a906d6a) changes from eugene's comments on reviewboard #88122 (@gkoo)
 * [4f845d1](https://github.com/linkedin/hopscotch/commit/4f845d1a6f9f61f6095f5c6a7129a684c33d818f) fix some alignment for the bubble (@gkoo)
 * [3cce1dc](https://github.com/linkedin/hopscotch/commit/3cce1dcb2d93949805eb1e3285a8434af16e32e0) change close button text to i18n version (@gkoo)
 * [c1f3069](https://github.com/linkedin/hopscotch/commit/c1f30698dec06c9bc6a326ed487eb1970de8e3d7) change how options are defaulted, plus few other bug fixes (@gkoo)
 * [bd5eb1e](https://github.com/linkedin/hopscotch/commit/bd5eb1e1eb488205ab343c0b0af3484c7afb1aeb) forgot to add one line to jquery version, also minify (@gkoo)
 * [827e2cf](https://github.com/linkedin/hopscotch/commit/827e2cf5a9e68888cde06ef741efefe8acebb256) remove cookie from configurable options (@gkoo)
 * [e52b256](https://github.com/linkedin/hopscotch/commit/e52b256deba4b779d6f76168dc6e23aa02e9fb06) remove some config options, invoke error cb for skipIfNoElement (@gkoo)
 * [31fc5c5](https://github.com/linkedin/hopscotch/commit/31fc5c57edd401de89a3d10d0490bee14c8e0048) initial work on flip stuff (@gkoo)
 * [3f01e2e](https://github.com/linkedin/hopscotch/commit/3f01e2e33f376b018c2989313f2b8a4508a50fc2) handle case where first element isn't present (@gkoo)
 * [6f027ba](https://github.com/linkedin/hopscotch/commit/6f027ba8536e1c4b08b005dbabb68a8ffc78748e) don't invoke end callback if first element is missing (@gkoo)
 * [1d95c92](https://github.com/linkedin/hopscotch/commit/1d95c9261fcd27693c24be1ba1e1735a5a156703) change the way next callbacks are invoked (@gkoo)
 * [ed53308](https://github.com/linkedin/hopscotch/commit/ed5330820202ba28192001f263efa9cf26d5d646) fix arrow offset bug (@gkoo)
 * [402c3a6](https://github.com/linkedin/hopscotch/commit/402c3a6ccb6ef00112111eac55ebc208c734b395) call start callback even if resuming multi-page tour (@gkoo)
 * [71cc66a](https://github.com/linkedin/hopscotch/commit/71cc66af5a085a2ad56e135a962248fa73a6ddd9) handle fixed positioned elements (@gkoo)
 * [9cdf846](https://github.com/linkedin/hopscotch/commit/9cdf84639db5ce8bddcf875af129d4bace3f6b33) add the minify scripts (@gkoo)
 * [cd71009](https://github.com/linkedin/hopscotch/commit/cd71009b3db51f67fffbfde7de7e1993da18f7a1) added delay, z-index option for steps (@gkoo)
 * [c999f61](https://github.com/linkedin/hopscotch/commit/c999f619b48548896fc5dca0b98e47a3f79f6f8a) fixed a bug on flip. (flip not implemented on jquery version yet) (@gkoo)
 * [0b09e72](https://github.com/linkedin/hopscotch/commit/0b09e72792b8ec0ee2da84142bee6f9c923a96ec) hide bubble on prevbtn click (for autoscroll) (@gkoo)
 * [db7c2bb](https://github.com/linkedin/hopscotch/commit/db7c2bb753a91eef3f9a6608f9f0dd0502f3c950) fade in transition for bubble (@gkoo)
 * [36ba397](https://github.com/linkedin/hopscotch/commit/36ba3978baba5248dd660cad4d7f64fbc708647c) add in the minified versions of fade stuff (@gkoo)
 * [9a06569](https://github.com/linkedin/hopscotch/commit/9a0656983a926bee2f2cfcb21cf7ee3a248d0ddd) added onShow callback (@gkoo)
 * [64b83cf](https://github.com/linkedin/hopscotch/commit/64b83cf2b43b93829ba2672c2e22905f77e7d176) oops, forgot two more references to bounce (@gkoo)
 * [cee0858](https://github.com/linkedin/hopscotch/commit/cee0858404d8f1b358b92e1defe2e5ba4a1ea516) add setCookie api call (@gkoo)
 * [732e3b5](https://github.com/linkedin/hopscotch/commit/732e3b539f21f14f637fc2d682b159eed8accf0c) fix a merge bug (@gkoo)
 * [2cdb71c](https://github.com/linkedin/hopscotch/commit/2cdb71c3d1b7769e8f7d5bf976808c682b025e60) updated sprites (@gkoo)
 * [0c7a7a2](https://github.com/linkedin/hopscotch/commit/0c7a7a2f5ac74e308ab5c7fb78965e36ccd1d8ac) fixed a bug with animate (@gkoo)
 * [ea34f44](https://github.com/linkedin/hopscotch/commit/ea34f448c643b284db75dc7362a1420b006727d4) create vars.less for less variables (@gkoo)
 * [0bb4537](https://github.com/linkedin/hopscotch/commit/0bb45372d7f1b5fcd90beb3b60a8985f1e537ad8) a couple more additions to vars.less (@gkoo)
 * [fc91035](https://github.com/linkedin/hopscotch/commit/fc91035b45a3842bb800e4773bffd8b498a2b3c0) add jquery checks back in (@gkoo)
 * [bae5eba](https://github.com/linkedin/hopscotch/commit/bae5ebafc3f1fdd17de3107b41a630800f1dbf07) check delay for nextOnTargetClick (@gkoo)
 * [680ef4b](https://github.com/linkedin/hopscotch/commit/680ef4bdb89db158ecf77a194518cf8c49fa138b) fix delay for nextOnTargetClick (@gkoo)
 * [10b0327](https://github.com/linkedin/hopscotch/commit/10b0327816c3992aa88bbca89921d27c880bb448) some css tweaks hans requested (@gkoo)
 * [32af391](https://github.com/linkedin/hopscotch/commit/32af391ec3b2aaf084272285c50e267f98b72098) update demo page (@gkoo)
 * [6006364](https://github.com/linkedin/hopscotch/commit/6006364965a917a80891ee70a26b40feaffc31ef) added TODO file (@gkoo)
 * [050085b](https://github.com/linkedin/hopscotch/commit/050085b79094dda1f7793bc81fee6f21c946da48) add a comment to bubble.hide() (@gkoo)
 * [709af75](https://github.com/linkedin/hopscotch/commit/709af75d2c464d3c6c5ba906ab05529fe1df7a1a) add JSDocs and adjust some commenting (@gkoo)
 * [0e7d199](https://github.com/linkedin/hopscotch/commit/0e7d199d8195e7ee65223a99f3bbcea26539e9b5) minifying from previous commit (@gkoo)
 * [4f34083](https://github.com/linkedin/hopscotch/commit/4f34083d716cd7ec795ddfccc6f31bb81187fbc1) getting rid of cruft files in docs (@gkoo)
 * [d0b2295](https://github.com/linkedin/hopscotch/commit/d0b2295be006f72a72884e09e103f45da640b4cf) change file name to reflect version (@gkoo)
