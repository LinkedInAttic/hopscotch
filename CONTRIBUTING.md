Contributing to Hopscotch
=========================

Thanks for taking the time to contribute back to Hopscotch! Below are some guidelines for how you can contribute to the project, including some details about how we triage bug reports and pull requests.

> Note: We're currently in the midst of refactoring Hopscotch into a newer module-based format that should help make readability and maintenance a lot easier. While this work is in progress, we'll be halting changes to the master branch of Hopscotch, apart from major maintenance fixes. Please feel free to continue submitting bug reports, though do keep in mind that they not be addressed in the current iteration of the library. Thanks!

Yikes! I found a bug! What now?
-------------------------------
We use GitHub for triaging new bugs. To help the community better understand the issue you've run into, check for the following...

- Has the issue been reported previously? Please take a quick look through the Open Issues on GitHub to see if someone else has reported the issue previously.
- Is the issue you're reporting related to Hopscotch? Please make sure the bug you're reporting is an issue with the Hopscotch library.
- What version of Hopscotch did you see the issue in? Has the issue been fixed in a later version?
- How do we reproduce the issue? Browser details, code snippets, and/or results from any debugging you've had the chance to do on the issue are extremely helpful!
- What happened? What should've happened? It helps to get a clear understanding of what you were trying to do when the error occured.

It would be awesome if Hopscotch had X feature! When are you planning to add it in?
-----------------------------------------------------------------------------------
As with bugs, we use GitHub for tracking feature requests. When submitting a new feature request, please keep in mind...

- Currently, we're in the middle of moving Hopscotch through a significant refactoring, which will allow us to better manage updates in the future. Please feel free to continue submitting requests, however please keep in mind we may be holding off on making major enhancements for now.
- One of our major principles with designing the Hopscotch API is to keep the core Hopscotch library simple. Hopscotch should be really good at running tours and displaying callouts, while providing hooks into critical keyframes during a tour's lifecycle for developers to mix in their own added functionality. This allows us to keep the core library at a manageable size and avoid configuration bloat. Please keep in mind we may vote against enhancements that could be just as well achieved through other means (such as callbacks or CSS tweaks).
  - Of note, we're planning to add in plugin-like functionality in the near future that should make it easier for developers to integrate new features into their version of Hopscotch in a more "black box" fashion. It's our hope that this solution will allow for the contribution of awesome new features without having to be included with the core library. See [this Gist](https://gist.github.com/zimmi88/3dbac8f8a035bd6fe8d4) for more details.
- Be sure to provide details about what you'd like to see added, as well as any thoughts you have on how to best include it into Hopscotch. What impact should this new feature have on the API? Should it be enabled by default?

I have a code change! How do I get it included into Hopscotch?
--------------------------------------------------------------
Awesome! Please submit a pull request for your issue. Or, more specifically...

1. Create a new fork of this repository.
2. Make your changes in a branch, then push that branch to your fork on GitHub.
  - To help expedite the review process, please make sure your branch is caught up to our master branch. You can use `git rebase` to replay your branch's commits after the latest commit to master.
  - If there are a significant number of commits on your issue branch, consider squashing your commit history from before the pull request.
3. Use GitHub to create a pull request from your issue branch. It's helpful to include the following in your pull request...
  - If this pull request fixes an issue (or issues) that's been previously filed, add the issue ID to your request.
  - What does this change do? Depending on how significant the change is, consider including usage details.
  - What testing have you done? All pull requests are run through our test suite on [Travis CI](https://travis-ci.org/). If you've done any additional manual testing, let us know.
  - Does this pull request also include unit tests for newly-written code? Where possible, please include automated tests so we can make sure we don't break this later.
4. Sit back and wait for community feedback. If changes are required, please commit to and push changes in your issue branch to GitHub. Since GitHub won't automatically send notifications when changes are made to your branch, please re-post in the pull request thread so we catch the changes.

Pull requests that have been approved for merge will receive a last call for comments from a project owner or core contributor. A short amount of time thereafter (usually around 24 hours), we'll merge the branch with master.

How do I create a new release? What do those numbers mean?
----------------------------------------------------------
(Note: There's no need to make a new release with each pull request; Project Owners will take care of generating releases from the master branch as outlined below.)

Release management is controlled via Grunt. Running `grunt releasePatch` or `grunt releaseMinor` depending on what version we're releasing.

- Patch releases fix minor bugs and issues found by the development community. These releases generally don't introduce significant new features into the Hopscotch API.
- Minor releases are reserved for the introduction of new features and/or significant code changes.

The aformentioned Grunt tasks will bump the version number, generate Hopscotch's distributable files and zip them into an archive, and make a commit with these new files. As with other changes, run this in a branch and make a pull request from that branch.