describe('Config option "target"', () => {
  describe('Callout missing target', () => {
    it('Should throw an exception when standalone callout does not have a valid target', () => {
      let calloutMgr = hopscotch.getCalloutManager();
      let calloutID = 'callout-no-target';
      expect(() => {
        calloutMgr.createCallout({
          id: calloutID,
          target: 'totally-does-not-exist',
          placement: 'bottom',
          title: 'This test is fun!',
          content: 'This is how we test this library!'
        });
      }).toThrow(new Error('Must specify an existing target element via \'target\' option.'));

      expect(calloutMgr.getCallout(calloutID)).toBeUndefined();
    });
  });
});