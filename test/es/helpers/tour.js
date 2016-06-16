function verifyNoTourActive() {
  expect(hopscotch.getCurrStepNum()).toEqual(null);
  expect(hopscotch.getCurrStepCallout()).toEqual(null);
  expect(hopscotch.getCurrTour()).toEqual(null);
}

let TourTestUtils = {
  verifyNoTourActive
};

export default TourTestUtils;