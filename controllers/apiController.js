const Item = require("../models/Item");
const Treasure = require("../models/Activity");
const Traveler = require("../models/Booking");
const Category = require("../models/Category");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title country city price unit imageId")
        .limit(5)
        .populate({ path: "imageId", select: "_id imageUrl" });
      const treasure = await Treasure.find();
      const traveler = await Traveler.find();
      const city = await Item.find();
      const category = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title country city isPopular imageId",
          perDocumentLimit: 4,
          options: { sort: { sumBooking: -1 } },
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });

      for (let i = 0; i < category.length; i++) {
        for (let x = 0; x < category[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: category[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          if (category[i].itemId[0] === category[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      const testimonial = {
        id: "asd1293uasdads1",
        imageUrl: "images/testimonial2.jpg",
        name: "Happy Customer",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time...",
        familyName: "Aslan",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        hero: {
          travelers: traveler.length,
          treasures: treasure.length,
          cities: city.length,
        },
        mostPicked,
        category,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "_id imageUrl" })
        .populate({ path: "featureId", select: "_id name qty imageUrl" })
        .populate({ path: "activityId", select: "_id name type imageUrl" });

      const bank = await Bank.find();

      const testimonial = {
        id: "asd1293uasdads1",
        imageUrl: "images/testimonial1.jpg",
        name: "Happy Customer",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time...",
        familyName: "Aslan",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
