"use strict"

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("card", [{
        mainValue: "A",
        secondaryValue: "E",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide10.JPG?alt=media&token=a7713cd7-3b87-490a-b0aa-3850f8434cf9"
      },
      {
        mainValue: "A",
        secondaryValue: "F",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide21.JPG?alt=media&token=0615f98f-3f4f-4279-844e-b6f41bda9930"
      },
      {
        mainValue: "A",
        secondaryValue: "G",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide19.JPG?alt=media&token=ceca0c6b-d70c-4462-bb2a-24fd80e00b62"
      },
      {
        mainValue: "A",
        secondaryValue: "H",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide2.JPG?alt=media&token=dbb64b3e-fa78-4980-9fae-e9c3e9c2135b"
      },
      {
        mainValue: "B",
        secondaryValue: "E",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide20.JPG?alt=media&token=33b05ccb-7b53-49a4-9206-2729cc44dee6"
      },
      {
        mainValue: "B",
        secondaryValue: "F",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide26.JPG?alt=media&token=f115fa69-5940-4649-8c76-74b944318726"
      },
      {
        mainValue: "B",
        secondaryValue: "G",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide47.JPG?alt=media&token=467ef1e8-8074-49e6-9ba8-796ceac55955"
      },
      {
        mainValue: "B",
        secondaryValue: "H",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide48.JPG?alt=media&token=4390fbe8-b693-496f-9470-b72d651bee29"
      },
      {
        mainValue: "C",
        secondaryValue: "E",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide5.JPG?alt=media&token=9c3daf6f-68e2-4376-9e35-9a18a388944a"
      },
      {
        mainValue: "C",
        secondaryValue: "F",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide7.JPG?alt=media&token=baec489a-767e-4d72-a317-03beb125c969"
      },
      {
        mainValue: "C",
        secondaryValue: "G",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide8.JPG?alt=media&token=24246bdb-d572-4019-bce7-73f7a0160f39"
      },
      {
        mainValue: "C",
        secondaryValue: "H",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide45.JPG?alt=media&token=f994e6f7-0058-4f45-9698-8a6e0ef2ec0d"
      },
      {
        mainValue: "D",
        secondaryValue: "E",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide46.JPG?alt=media&token=021bc497-2617-4738-8427-d331bb03b596"
      },
      {
        mainValue: "D",
        secondaryValue: "F",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide48.JPG?alt=media&token=4390fbe8-b693-496f-9470-b72d651bee29"
      },
      {
        mainValue: "D",
        secondaryValue: "G",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide8.JPG?alt=media&token=24246bdb-d572-4019-bce7-73f7a0160f39"
      },
      {
        mainValue: "D",
        secondaryValue: "H",
        cardsetId: 1,
        img: "https://firebasestorage.googleapis.com/v0/b/msci342images.appspot.com/o/images%2FSlide9.JPG?alt=media&token=8e92b2d0-9f59-4bd8-8005-f5ffc42e9de6"
      }
    ], {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("card", null, {})
  }
}
